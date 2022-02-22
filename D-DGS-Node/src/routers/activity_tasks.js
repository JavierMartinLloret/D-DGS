const express = require("express");
const activity_tasksModel = require("../models/activity_tasks");
const activity_tasksRouter = new express.Router();

activity_tasksRouter.get('/activities_tasks', async (req, res) => {
    try {
        const currentRelationships = await activity_tasksModel.find({});
        res.status(200).send(currentRelationships);
    } catch (error) {
        res.status(500).send(error);
    }
})

activity_tasksRouter.get('/activities_tasks/domain/:key', async (req, res) => {
    try {
        const domainKey = req.params.key;
        const query = {"domain_key": domainKey};
        const relationships = await activity_tasksModel.find(query);

        res.status(200).send(relationships);
    } catch (error) {
        res.status(500).send(error);
    }
})

activity_tasksRouter.get('/activities_tasks/:id', async (req, res) => {
    try {
        /* THE ID THAT COMES IS THE ACTIVITY's ONE */
        const parentActivityID = req.params.id;
        const query = {"activity": parentActivityID};
        const relationship = await activity_tasksModel.findOne(query);
        res.status(200).send(relationship);
    } catch (error) {
        res.status(500).send(error);
    }
})

activity_tasksRouter.post('/activities_tasks', async (req, res) => {
    try {
        const newRelationship = new activity_tasksModel(req.body);
        await newRelationship.save();
        res.status(201).send(newRelationship);
    } catch (error) {
        res.status(500).send(error);
    }
})

activity_tasksRouter.put('/activities_tasks/:id', async (req, res) =>{
    try {
        const updatedRelationshipID = req.body._id;
        const updatedRelationship = new activity_tasksModel(req.body);

        const query = {"_id": updatedRelationshipID};
        const update = {$set:{
            "activity": updatedRelationship.activity,
            "tasks": updatedRelationship.tasks
        }};

        await activity_tasksModel.updateOne(query, update);

        res.status(200).send(true);
        
    } catch (error) {
        res.status(500).send(error);
    }
})

activity_tasksRouter.delete('/activities_tasks/:id', async (req, res) => {
    try {
        const relationshipID = req.params.id; //body._id??
        const query = {"_id": relationshipID};

        await activity_tasksModel.deleteOne(query);

        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = activity_tasksRouter;