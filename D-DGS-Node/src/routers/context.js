const express = require("express");
const Context = require("../models/context");
const contexRouter = new express.Router();

// Get all contexts
contexRouter.get('/context', async (req, res) => {
    try {
        const contexts = await Context.find({});
        res.status(200).send(contexts);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Get all contexts associated with one user
contexRouter.get('/context/bydomain/:domainIdentificator', async (req, res) => {
    try {
        const domainKey = req.params.domainIdentificator;
        const query = {"domain_key": domainKey};
        const contexts = await Context.find(query);

        res.status(200).send(contexts);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Get one context
contexRouter.get('/context/byid/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const query = {"_id": id};
        const context = await Context.findOne(query);

        res.status(200).send(context);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Post a new context
contexRouter.post('/context', async (req, res) => {
    const context = new Context(req.body);
    try {
        await context.save();
        res.status(201).send(context._id);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Delete all contexts associated with one user
contexRouter.delete('/context/bydomain/:domainIdentificator', async (req, res) => {
    const domainKey = req.params.domainIdentificator;
    const query = {"domain_key": domainKey};

    try {
        await Context.deleteMany(query);
        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Delete one specific context
contexRouter.delete('/context/byid/:id', async (req, res) => {
    const id = req.params.id;
    const query = {"_id": id};

    try {
        await Context.deleteOne(query);
        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = contexRouter;