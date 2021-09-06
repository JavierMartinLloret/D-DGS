const express = require("express");
const UserModel = require('../models/user');
const router = new express.Router();

// This is to create an endpoint for the REST API
router.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;