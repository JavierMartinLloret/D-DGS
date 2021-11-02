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