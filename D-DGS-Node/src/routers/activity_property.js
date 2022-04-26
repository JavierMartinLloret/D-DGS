const express = require("express");
const ActivityProperty = require("../models/activity_property");
const activityPropertyRouter = new express.Router();

activityPropertyRouter.get('/activity_property', async (req, res) => {
    try {
        const properties = await ActivityProperty.find({});
        res.status(200).send(properties);
    } catch (error) {
        res.status(500).send(error);
    }
})

activityPropertyRouter.post('/activity_property', async (req, res) => {
    const property = new ActivityProperty(req.body);
    try {
        await property.save();
        res.status(201).send(property._id);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = activityPropertyRouter;