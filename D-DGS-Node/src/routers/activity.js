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
        send.status(500).send(error);
    }
})

// Register an activity in DB
activityRouter.post('/activities', async (req, res) => {
    // No he coseguido reproducir en Postman como enviar en la creación el campo tareas vacío.
    const activity = new Activity(req.body);
    try {
        await activity.save();
        res.status(201).send(activity);
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