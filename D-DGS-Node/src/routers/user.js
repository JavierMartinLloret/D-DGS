const express = require("express");
const User = require("../models/user");
const UserModel = require('../models/user');
const router = new express.Router();

// We create a GET endpoint in the API to call all users from DB
router.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;