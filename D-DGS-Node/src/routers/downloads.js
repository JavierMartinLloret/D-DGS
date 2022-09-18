const express = require("express");
const StrategyModel = require("../models/strategy");
const ActivityModel = require("../models/activity");
const PropertyModel = require("../models/activity_property");
const RewardModel = require ("../models/reward");
const LinkerModel = require("../models/linker");
const FileSystem = require('fs');

const diagramFilesPath = './src/downloadble_files/';

const DownloadsRouter = new express.Router();

const SUBSTRATEGY_NODE_CODE = "o_s";
const LINKER_NODE_CODE = "o_l";
const ACTIVITY_NODE_CODE = 'o_a';
const PROPERTY_NODE_CODE = 'o_p';
const REWARD_NODE_CODE = 'o_r';
const ABSOLUT_STRING_CODE = 's';
const ABSOLUT_DATE_CODE = 'd';
const ABSOLUT_NUMBER_CODE = 'n';

function exportStrategyToString(strategy, activitiesFromDomain, allProperties, rewardsFromSet, Operators) {
    let fileContent = '<?xml version="1.0" encoding="UTF-8"?><DDGSStrategyFile version="1.2"><Strategy>';
    let strategyParameters = '<Id>'+strategy._id+'</Id><Name>'+strategy.name+'</Name>'+'<Description>'+strategy.description+'</Description>';
    let domainParameters = '<Domain><Id>'+strategy.domain._id+'</Id><Name>'+strategy.domain.name+'</Name>';
    let activitiesParameters = '';
    let currentActivity = '';
    let Activitycounter = 0;
    let propertyCounter = 0;
    let activityIDMap = new Map([]);
    let propertyIDMap = new Map([]);
    let rewardIDMap = new Map([]);
    activitiesFromDomain.forEach(activity => {
        let str = ''+activity._id;
        activityIDMap.set(str, Activitycounter);
        currentActivity = '<Activity><Id>'+Activitycounter+'</Id><Name>'+activity.name+'</Name><Description>'+activity.description+'</Description><Properties>';
        let currentPropertyParameter = '';
        let allPropertiesOfAnActivity = '';
        

        allProperties.forEach(property => {
            if(property.activity_ID == activity._id)
            {
                let str = ''+property._id;
                propertyIDMap.set(str, propertyCounter);
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
        let str = ''+reward._id;
        rewardIDMap.set(str, rewardCounter);
        currentRewardParameter = '<Reward><Id>'+rewardCounter+'</Id><Name>'+reward.name+'</Name><Description>'+
        reward.description+'</Description><Priority>'+reward.priority+'</Priority></Reward>';
        RewardParameters+= currentRewardParameter;
        rewardCounter++;
    })
    RewardParameters += '</RewardSet>';

    let OperatorParameters = '<Operators>';
    let CurrentOperator = '';
    let operatorCounter = 0;
    let operatorIdMap = new Map([]);
    Operators.forEach(operator => {
        operatorIdMap.set(operator.name, operatorCounter);
        CurrentOperator = '<Operator><Id>'+operatorCounter+'</Id><Name>'+operator.name+'</Name><Category>'+operator.category+'</Category></Operator>';
        OperatorParameters += CurrentOperator;
        operatorCounter++;
    })
    OperatorParameters += '</Operators>';

    let SubstrategiesParameters = '<Substrategies>';
    let substrategyNodesReferences = [];
    strategy.node_references.forEach(reference => {
        if(reference.nodeType == SUBSTRATEGY_NODE_CODE)
            substrategyNodesReferences.push(reference);
    })
    let substrategyCounter = 0;
    let currentSubstrategy = '';
    substrategyNodesReferences.forEach(reference => {
        currentSubstrategy = '<Substrategy><Id>'+substrategyCounter+'</Id><Name>'+reference.value+'</Name><Criteria>';
        let currentCriterion = '';
        strategy.node_references.forEach(LinkerReference => {
            if(LinkerReference.nodeType == LINKER_NODE_CODE) // Nodo es tipo enlace
            {
                strategy.nodes.forEach(node => {
                    if(node.id == LinkerReference.idInDiagram) // node es el nodo buscado.
                    {
                        currentCriterion = '<Criterion><C_Operator>'+operatorIdMap.get(node.label)+'</C_Operator><Operands>';
                        // Uno por operando
                        let currentOperand = '';
                        strategy.edges.forEach(edge => {
                            if(edge.to == node.id)
                            {
                                // edge.from == id del nodo operando
                                strategy.node_references.forEach(operandReference => {
                                    if(operandReference.idInDiagram == edge.from)
                                    {
                                        let str = ''
                                        switch (operandReference.nodeType) {
                                            case SUBSTRATEGY_NODE_CODE:
                                                currentOperand = '<Operand><Type>Substrategy</Type><Id>'+substrategyCounter+'</Id></Operand>';break;
                                            case ACTIVITY_NODE_CODE:
                                                currentOperand = '<Operand><Type>Activity</Type><Id>'+str+activityIDMap.get(operandReference.value)+'</Id></Operand>';break;
                                            case PROPERTY_NODE_CODE:
                                                currentOperand = '<Operand><Type>Property</Type><Id>'+str+propertyIDMap.get(operandReference.value)+'</Id></Operand>';break;
                                            case ABSOLUT_STRING_CODE:
                                                currentOperand = '<Operand><Type>Absolute(String)</Type><Value>'+operandReference.value+'</Value></Operand>';break;
                                            case ABSOLUT_DATE_CODE:
                                                currentOperand = '<Operand><Type>Absolute(Date)</Type><Value>'+operandReference.value+'</Value></Operand>';break;
                                            case ABSOLUT_NUMBER_CODE:
                                                currentOperand = '<Operand><Type>Absolute(Number)</Type><Value>'+operandReference.value+'</Value></Operand>';break;
                                            default:
                                                break;
                                        }
                                    }
                                })
                                currentCriterion += currentOperand;
                            }
                        })
                        currentCriterion += '</Operands></Criterion>';
                        currentSubstrategy += currentCriterion;
                    }
                    
                })
            }
        })
        substrategyCounter++;
        currentSubstrategy += '</Criteria><SS_Rewards>';
        let currentSSReward = '';
        strategy.node_references.forEach(rewardReference => {
            if(rewardReference.nodeType == REWARD_NODE_CODE)
            {
                let str = '';
                currentSSReward = '<SS_Reward><Id>'+str+rewardIDMap.get(rewardReference.value)+'</Id><Value>1</Value></SS_Reward>';
                currentSubstrategy += currentSSReward;
            }
        })

        // One per SS_Rewards
        currentSubstrategy += '</SS_Rewards></Substrategy>';
        SubstrategiesParameters += currentSubstrategy;
    })
    // One per Substrategy
    SubstrategiesParameters += '</Substrategies>';

    return fileContent+strategyParameters+domainParameters+activitiesParameters+RewardParameters+OperatorParameters+SubstrategiesParameters;
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