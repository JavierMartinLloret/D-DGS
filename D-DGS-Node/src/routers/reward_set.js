const express = require("express");
const RewardSet = require("../models/reward_set");
const rewardSetRouter = new express.Router();

rewardSetRouter.get('/reward_set', async (req, res) => {
    try {
        const sets = await RewardSet.find({});
        res.status(200).send(sets);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = rewardSetRouter;