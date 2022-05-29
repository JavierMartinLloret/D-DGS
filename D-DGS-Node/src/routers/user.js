const express = require("express");
const User = require("../models/user");
const UserModel = require('../models/user');
const userRouter = new express.Router();

// Get All
userRouter.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
})
// Get One By ID
userRouter.get('/users/:id', async (req, res) => {
    try {
        const userID = req.params.id;
        const query = {"_id": userID};
        const userSought = await UserModel.findOne(query);

        res.status(200).send(userSought);
    } catch (error) {
        res.status(500).send(error);
    }
})
// Get domain_key
userRouter.get('/users/:nick/:pass', async (req, res) => {
    let query = 
    {
        "nickname" : req.params.nick,
        "password" : req.params.pass
    };

    try {
        const user = await UserModel.findOne(query);
        let domain_key = JSON.stringify(user.domain_key);
        res.status(200).send(domain_key);
    } catch (error) {
        res.status(500).send(error);
    }
})
// Is this user an Administrator ?
userRouter.get('/users/One/ByDomain/:domainIdentificator', async (req, res) => {
    try {
        const userIdentificator = req.params.domainIdentificator;
        const query = {
            "domainIdentificator": userIdentificator,
            "is_admin": true
        };
        const queryResult = await UserModel.find(query);
        if(JSON.stringify(queryResult) != "[]")
            res.status(200).send(true);
        else
            res.status(200).send(false);
    } catch (error) {
        res.status(500).send(error);
    }
})
// Post One
userRouter.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user); // 201 === Resource created
    } catch (error) {
        res.status(500).send(error);
    }
})
// Modifies the user's profile
userRouter.put('/users/:id', async (req, res) => {
    try {
        const updatedUser = new UserModel(req.body);
        const query = {"_id": req.params.id};
        const update = {$set:{
            "nickname": updatedUser.nickname,
            "email": updatedUser.email,
            "password": updatedUser.password,
            "is_admin": updatedUser.is_admin
        }}

        await UserModel.updateOne(query, update);

        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})

// Deletes the user from DB
userRouter.delete('/users/:id', async (req, res) => {
    try {
        const userID = req.params.id;
        const query = {"_id": userID};

        await UserModel.deleteOne(query);

        res.status(200).send(true);
    } catch (error) {
        res.status(500).send(error);
    }
})

// GetLastIdFromUsers
userRouter.get('/lastId', async (req, res) =>{
    try {
        
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = userRouter;