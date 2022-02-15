const express = require("express");
const LineModel = require("../models/line");
const Line = require("../models/line");

const LineRouter = new express.Router();

// Get All
LineRouter.get('/lines', async (req, res) => {
    try {
        const lines = await LineModel.find({});
        res.status(200).send(lines);
    } catch (error) {
        res.status(500).send(error);
    }
})
// Get One
LineRouter.get('/lines/:id', async (req, res) => {
    try {
        const LineID = req.params.id;
        const query =  {"_id": LineID};
        const lineSought = await LineModel.findOne(query);

        res.status(200).send(lineSought);
    } catch (error) {
        res.status(500).send(error);
    }
})
// Post One
LineRouter.post('/lines', async (req, res) => {
    const lineModel = new Line(req.body);
    try {
        await lineModel.save();
        res.status(201).send(lineModel._id);
    } catch (error) {
        res.status(500).send(error);
    }
})
// Update One
LineRouter.put('/lines/:id', async (req, res) => {
    try {
        const updatedLine = new Line(req.body);

        const query = {"_id": req.params.id};
        const update = {$set:{
            "activities": updatedLine.activities,
            "rewards": updatedLine.rewards
        }};

        await LineModel.updateOne(query, update);
        
        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})
// Delete One
LineRouter.delete('/lines/:id', async (req, res) => {
    try {
        const lineID = req.params.id;
        const query = {"_id": lineID};

        await LineModel.deleteOne(query);

        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = LineRouter;