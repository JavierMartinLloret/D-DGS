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
        const query = {"_id": DiagramID};
        const userSought = await UserModel.findOne(query);

        res.status(200).send(userSought);
    } catch (error) {
        res.status(500).send(error);
    }
})
// Get DomainID
userRouter.get('/users/:nick/:pass', async (req, res) => {
    const query = {
        "nickname": req.params.nick,
        "password": req.params.pass
    };
    let userSought;
    try {
        userSought = await UserModel.findOne(query);        
    } catch (error) {
        res.status(500).send(error);
    }
    if(userSought != null)
        res.status(200).send(JSON.stringify(userSought.domainIdentificator));
    else
        res.status(200).send(JSON.stringify("FAILED"));  
    
    
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
            "domainIdentificator": updatedUser.domainIdentificator
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