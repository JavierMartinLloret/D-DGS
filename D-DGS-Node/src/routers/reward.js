const express = require("express");
const Reward = require("../models/reward");
const RewardModel = require("../models/reward");
const rewardRouter = new express.Router();

rewardRouter.get('/rewards', async (req, res) => {
    try {
        const rewards = await RewardModel.find({});
        res.status(200).send(rewards);
    } catch (error) {
        res.status(500).send(error);
    }
})

rewardRouter.get('/rewards/domain/:key', async (req, res) => {
    try {
        const domainKey = req.params.key;
        const query = {"domain_key": domainKey};
        const rewards = await RewardModel.find(query);

        res.status(200).send(rewards);
    } catch (error) {
        res.status(500).send(error);
    }
})

rewardRouter.get('/rewards/:id', async (req, res) => {
    try {
        const rewardID = req.params.id;
        const query = {"_id": rewardID};
        const reward = await RewardModel.findOne(query);

        res.status(200).send(reward);
    } catch (error) {
        res.status(500).send(error);
    }
})

rewardRouter.post('/rewards', async (req, res) => {
    const reward = new Reward(req.body);
    try {
        await reward.save();
        res.status(201).send(reward); // No habría por qué enviar la reward
    } catch (error) {
        res.status(500).send(error);
    }
})

rewardRouter.put('/rewards/:id', async (req, res) => {
    try {
        const rewardID = req.params.id;
        const query = {"_id": rewardID};
        const updatedReward = new Reward(req.body);

        const update = {$set:{
            "name": updatedReward.name,
            "description": updatedReward.description
        }};

        await RewardModel.updateOne(query, update);

        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})

rewardRouter.delete('/rewards/:id', async (req, res) => {
    try {
        const rewardID = req.params.id;
        const query = {"_id": rewardID};
        
        await RewardModel.deleteOne(query);

        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = rewardRouter;