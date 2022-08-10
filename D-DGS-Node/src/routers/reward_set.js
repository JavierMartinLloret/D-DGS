const express = require("express");
const RewardSet = require("../models/reward_set");
const rewardSetRouter = new express.Router();

// Get all Sets in DB
rewardSetRouter.get('/reward_set', async (req, res) => {
    try {
        const sets = await RewardSet.find({});
        res.status(200).send(sets);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Get all Sets from an specific user
rewardSetRouter.get('/reward_set/fromdomain/:domain', async (req, res) => {
    try {
        const domain = req.params.domain;
        const query = {"domain_key": domain};
        const sets = await RewardSet.find(query);

        res.status(200).send(sets);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Get a Set
rewardSetRouter.get('/reward_set/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = {"_id": id};
        const set = await RewardSet.find(query);

        res.status(200).send(set);
    } catch (error) {
        res.status(500).send(error)
    }
})

// Post a Set
rewardSetRouter.post('/reward_set', async (req, res) => {
    try {
        const set = new RewardSet(req.body);
        await set.save();
        
        res.status(201).send(set._id);
    } catch (error) {
        res.status(500).send(error)
    }
})

// Update a Set
rewardSetRouter.put('/reward_set', async (req, res) => {
    try {
        const updatedSet = new RewardSet(req.body);

        const query = {"_id": req.body._id};
        const update = {$set:{
            "name": updatedSet.name
        }};

        await RewardSet.updateOne(query, update);

        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Delete a set
rewardSetRouter.delete('/reward_set/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = {"_id": id};

        await RewardSet.deleteOne(query);
        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Delete all sets from an specific user
rewardSetRouter.delete('/reward_set/fromdomain/:domain', async (req, res) => {
    try {
        const domain = req.params.domain;
        const query = {"domain_key": domain};

        await RewardSet.deleteMany(query);
        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error)
    }
})

module.exports = rewardSetRouter;