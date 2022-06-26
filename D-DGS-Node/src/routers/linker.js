const express = require("express");
const LinkerModel = require("../models/linker");
const linkerRouter = new express.Router();

linkerRouter.get('/linkers', async (req, res) => {
    try {
        const linkers = await LinkerModel.find({});
        res.status(200).send(linkers);
    } catch (error) {
        res.status(500).send(error);
    }
});

linkerRouter.post('/linkers', async (req, res) => {
    const newLinker = new LinkerModel(req.body);
    try {
        await newLinker.save();
        res.status(201).send(newLinker._id);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = linkerRouter;