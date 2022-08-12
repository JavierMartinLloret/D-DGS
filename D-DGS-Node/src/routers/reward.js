const express = require("express");
const Reward = require("../models/reward");
const rewardRouter = new express.Router();

// Get all rewards
rewardRouter.get('/rewards', async (req, res) => {
    try {
        const rewards = await Reward.find({});
        res.status(200).send(rewards);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Get all rewards form a certain set
rewardRouter.get('/rewards/fromset/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = {"parent_set": id};
        const rewards = await Reward.find(query);

        res.status(200).send(rewards);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Get a reward from id
rewardRouter.get('/rewards/:id', async (req, res) => {
    try {
        const rewardID = req.params.id;
        const query = {"_id": rewardID};
        const reward = await Reward.findOne(query);

        res.status(200).send(reward);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Post a new reward
rewardRouter.post('/rewards', async (req, res) => {
    const reward = new Reward(req.body);
    try {
        await reward.save();
        res.status(201).send(reward._id);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Update a reward
rewardRouter.put('/rewards', async (req, res) => {
    try {
        const updatedReward = new Reward(req.body);
        const rewardID = updatedReward._id;
        const query = {"_id": rewardID};

        const update = {$set:{
            "parentSet": updatedReward.parentSet,
            "name": updatedReward.name,
            "description": updatedReward.description,
            "priority": updatedReward.priority
        }};

        await Reward.updateOne(query, update);

        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Delete a reward
rewardRouter.delete('/rewards/:id', async (req, res) => {
    try {
        const rewardID = req.params.id;
        const query = {"_id": rewardID};
        
        await Reward.deleteOne(query);

        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Delete all rewards from a certain set
rewardRouter.delete('/rewards/fromset/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = {"parent_set": id};
        await Reward.deleteMany(query);

        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = rewardRouter;