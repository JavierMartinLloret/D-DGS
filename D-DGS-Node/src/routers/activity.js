const express = require("express");
const Activity = require("../models/activity");
const ActivityModel = require("../models/activity");
const activityRouter = new express.Router();

// Get all activities in DB
activityRouter.get('/activities', async (req, res) => {
    try {
        const activities = await ActivityModel.find({});
        res.status(200).send(activities);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Get one activity
activityRouter.get('/activities/:id', async (req, res) => {
    try {
        const activtyID = req.params.id;
        const query = {"_id": activtyID};
        const activity = await ActivityModel.findOne(query);

        res.status(200).send(activity);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Register an activity in DB
activityRouter.post('/activities', async (req, res) => {
    const activity = new Activity(req.body);
    try {
        await activity.save();
        res.status(201).send(activity);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Upadte an activity
activityRouter.put('/activities', async (req, res) => {
    try {
        console.log(req);
        const updatedActivity = new Activity(req.body);
        
        const query = {"_id": req.body._id}; //     OBJETO LLEGA SIN ESTE _ID INICIALIZADO
        const update = {$set:{
            "name": updatedActivity.name,
            "description": updatedActivity.description
        }};

        await ActivityModel.updateOne(query, update);

        res.status(200).send(true);

    } catch (error) {
        res.status(500).send(error);
    }
})

activityRouter.delete('/activities/:id', async (req, res) => {
    try {
        const activityID = req.params.id;
        const query = {"_id": activityID}

        await ActivityModel.deleteOne(query);

        res.status(200).send(true)
    } catch (error) {
       res.status(500).send(error); 
    }
})

module.exports = activityRouter;