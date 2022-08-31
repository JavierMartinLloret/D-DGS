const express = require("express");
const StrategyModel = require("../models/strategy");
const strategyRouter = new express.Router();

// Get all Strategies in DB
strategyRouter.get('/strategies', async (req, res) => {   
    try {
        const strategies = await StrategyModel.find({});
        res.status(200).send(strategies);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Get all Strategies related to one user
strategyRouter.get('/strategies/fromAUser/:domain_key', async (req, res) => {
    try {
        const domain_key = req.params.domain_key;
        const query = {"domain_key": domain_key}
        const strategies = await StrategyModel.find(query);

        res.status(200).send(strategies);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Get an specific strategy
strategyRouter.get('/strategies/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = {"_id": id};
        const strategy = await StrategyModel.findOne(query);

        res.status(200).send(strategy);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Post a Strategy in DB
strategyRouter.post('/strategies', async (req, res) => {
    try {
        const strategy = new StrategyModel(req.body);
        await strategy.save();
        res.status(201).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Update a Strategy
strategyRouter.put('/strategies', async (req, res) => {
    console.log("Llega aquí");
    try {
        const updatedStrategy = new StrategyModel(req.body);
        const query = {"_id": req.body._id};
        const update = {$set:{
            "name": updatedStrategy.name,
            "description": updatedStrategy.description,
            "domain": updatedStrategy.domain,
            "reward_set": updatedStrategy.reward_set,
            "substrategies": updatedStrategy.substrategies
        }};

        await StrategyModel.updateOne(query, update);

        res.status(200).send(true);

    } catch (error) {
        res.status(500).send(error);
    }
})

// Delete an Strategy in DB
strategyRouter.delete('/strategies/:ID', async (req, res) => {
    try {
        const ID = req.params.ID;
        const query = {"_id": ID};

        await StrategyModel.deleteOne(query);

        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = strategyRouter;