const express = require("express");
const User = require("../models/user");
const UserModel = require('../models/user');
const router = new express.Router();

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send(error);
    }
})
// Returns the searched user or an empty object
router.get('/users/:id', async (req, res) => {
    try {
        let searchedId = new Number(req.params.id).valueOf();
        let query ={"id": searchedId};

        const user = await UserModel.findOne(query);

        if (user != null)
            res.status(200).send(user);
        else
            res.status(204).send({});

    } catch (error) {
        res.status(500).send(error);
    }
})
// Modifies the user's profile
router.put('/users/:id', async (req, res) => {
    try {
        const userID = new Number(req.params.id).valueOf();
        console.log("ID del usuario: "+userID);
        console.log("Body del objeto req: "+req.body);
        const updatedUser = new User(req.body);
        console.log("UpdatedUser object que se construye: "+updatedUser);


        const query = {"id": userID};
        const update = {$set:{
            "nickname": updatedUser.nickname,
            "email": updatedUser.email,
            "password": updatedUser.password,
            "is_active": updatedUser.is_active,
            "type_user": updatedUser.type_user
        }};

        await UserModel.updateOne(query, update);

        res.status(200).send(true);

    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

// GetLastIdFromUsers
router.get('/lastId', async (req, res) =>{
    try {
        const query = {};
        const sortParameters = {id: -1}; // Orden decreciente
        let lastInsertedUser = await UserModel.findOne(query).sort(sortParameters);
        let id = new Number(-1);

        if(lastInsertedUser != null) // Si no hubiera ningún usuario, se devuelve el id -1
        {
            let string = new String(lastInsertedUser);
            // Eliminamos el identificador de mongo
            let position = string.lastIndexOf("id:");
            string = string.substring(position, string.length);
            // Acotamos al identificador como tal
            let initialPosition = string.search(":");
            position = string.search(",");
            id = string.substring(initialPosition+2, position); // +2=== :ESPACIO
        }
        
        res.status(200).send(id);

    } catch (error) {
        res.status(500).send(error);
        console.log(error);
    }
})


router.post('/users', async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).send(user); // 201 === Resource created
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;