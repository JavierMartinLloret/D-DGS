const express = require("express");
const ActivityProperty = require("../models/activity_property");
const activityPropertyRouter = new express.Router();

// Get all properties defined in DB
activityPropertyRouter.get('/activity_property', async (req, res) => {
    try {
        const properties = await ActivityProperty.find({});
        res.status(200).send(properties);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Get all properties form a certain Activity via ID
activityPropertyRouter.get('/activity_property/fromactivity/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = {"activity_ID": id};
        const properties = await ActivityProperty.find(query);

        res.status(200).send(properties);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Get a property by its ID
activityPropertyRouter.get('/activity_property/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = {"_id": id};
        const property = await ActivityProperty.findOne(query);

        res.status(200).send(property)
    } catch (error) {
        res.status(500).send(error);
    }
})

// Post a new property
activityPropertyRouter.post('/activity_property', async (req, res) => {
    const property = new ActivityProperty(req.body);
    try {
        await property.save();
        res.status(201).send(property._id);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Update a property

// Delete a property
activityPropertyRouter.delete('/activity_property/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = {"_id": id};
        
        await ActivityProperty.deleteOne(query);
        res.status(200).send(true)
    } catch (error) {
        res.staus(500).send(error);
    }
})

// Delete all properties from a certain Activity
activityPropertyRouter.delete('/activity_property/fromactivity/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = {"activity_ID": id};
        await ActivityProperty.deleteMany(query);

        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = activityPropertyRouter;