const express = require("express");
const Activity = require("../models/activity");
const ActivityModel = require("../models/activity");
const activityRouter = new express.Router();

//Get all activities in DB
activityRouter.get('/activities', async (req, res) => {
    try {
        const activities = await ActivityModel.find({});
        res.status(200).send(activities);
    } catch (error) {
        send.status(500).send(error);
    }
})

module.exports = activityRouter;