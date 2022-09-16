const express = require("express");
const StrategyModel = require("../models/strategy");
const ActivityModel = require("../models/activity");
const PropertyModel = require("../models/activity_property");
const RewardModel = require ("../models/reward");
const LinkerModel = require("../models/linker");
const FileSystem = require('fs');

const diagramFilesPath = './src/downloadble_files/';

const DownloadsRouter = new express.Router();

function exportStrategyToString(strategy, activitiesFromDomain, allProperties, rewardsFromSet, Operators) {
    let fileContent = '<?xml version="1.0" encoding="UTF-8"?><DDGSStrategyFile version="1.2"><Strategy>';
    let strategyParameters = '<Id>'+strategy._id+'</Id><Name>'+strategy.name+'</Name>'+'<Description>'+strategy.description+'</Description>';
    let domainParameters = '<Domain><Id>'+strategy.domain._id+'</Id><Name>'+strategy.domain.name+'</Name>';
    let activitiesParameters = '';
    let currentActivity = '';
    let Activitycounter = 0;
    activitiesFromDomain.forEach(activity => {
        currentActivity = '<Activity><Id>'+Activitycounter+'</Id><Name>'+activity.name+'</Name><Description>'+activity.description+'</Description><Properties>';
        let currentPropertyParameter = '';
        let allPropertiesOfAnActivity = '';
        let propertyCounter = 0;

        allProperties.forEach(property => {
            if(property.activity_ID == activity._id)
            {
                currentPropertyParameter = '<Property><Id>'+propertyCounter+'</Id><Name>'+property.name+'</Name><Type>';
                if(property.value_Number != undefined)
                    currentPropertyParameter += 'number';
                if(property.value_String != undefined)
                    currentPropertyParameter += 'string';
                if(property.value_Date != undefined)
                    currentPropertyParameter += 'date';

                currentPropertyParameter += '</Type></Property>';
                allPropertiesOfAnActivity += currentPropertyParameter;
                propertyCounter++;
            }
        })

        currentActivity+= allPropertiesOfAnActivity+'</Properties></Activity>';
        Activitycounter++;
        activitiesParameters+= currentActivity;
    })
    activitiesParameters+= '</Domain>';

    let RewardParameters = '<RewardSet><Id>'+strategy.reward_set._id+'</Id><Name>'+strategy.reward_set.name+'</Name>';
    let currentRewardParameter = '';
    let rewardCounter = 0;
    rewardsFromSet.forEach(reward => {
        currentRewardParameter = '<Reward><Id>'+rewardCounter+'</Id><Name>'+reward.name+'</Name><Description>'+
        reward.description+'</Description><Priority>'+reward.priority+'</Priority></Reward>';
        RewardParameters+= currentRewardParameter;
        rewardCounter++;
    })
    RewardParameters += '</RewardSet>';

    let OperatorParameters = '<Operators>';
    let CurrentOperator = '';
    let operatorCounter = 0;
    Operators.forEach(operator => {
        CurrentOperator = '<Operator><Id>'+operatorCounter+'</Id><Name>'+operator.name+'</Name><Category>'+operator.category+'</Category></Operator>';
        OperatorParameters += CurrentOperator;
        operatorCounter++;
    })
    OperatorParameters += '</Operators>'
    

    return fileContent+strategyParameters+domainParameters+activitiesParameters+RewardParameters+OperatorParameters;
}

DownloadsRouter.get('/downloads/diagrams/.gamst/:id', async (req,res) => {
    var diagram, activitiesFromDomain, allProperties, rewardsFromSet, Operators, fileName;
    try {
        diagramID = req.params.id;
        diagram = await StrategyModel.findOne({"_id": diagramID});
        activitiesFromDomain = await ActivityModel.find({"context_ID": diagram.domain._id});
        allProperties = await PropertyModel.find({});
        rewardsFromSet = await RewardModel.find({"parent_set": diagram.reward_set._id});
        Operators = await LinkerModel.find({});

        
        fileName = "test.gam"
        FileSystem.writeFileSync(diagramFilesPath+fileName, exportStrategyToString(diagram, activitiesFromDomain, allProperties, rewardsFromSet, Operators), (err) => {if (err) throw err;});
        res.status(200).download(diagramFilesPath+fileName, fileName);
    } catch (error) {
        console.log("Error al escribir el fichero " + error);
    }
})

module.exports = DownloadsRouter;