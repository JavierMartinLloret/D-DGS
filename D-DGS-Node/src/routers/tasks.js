const express = require("express");
const { Mongoose } = require("mongoose");
const Task = require("../models/task");
const TaskModel = require("../models/task");
const taskRouter = new express.Router();

taskRouter.get('/tasks', async (req, res) => {
    try {
        const tasks = await TaskModel.find({});
        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
})

taskRouter.get('/tasks/domain/:key', async (req, res) => {
    try {
        const domainKey = req.params.key;
        const query = {"domain_key": domainKey};
        const tasks = await TaskModel.find(query);

        res.status(200).send(tasks);
    } catch (error) {
        res.status(500).send(error);
    }
})

taskRouter.get('/tasks/:id', async (req, res) => {
    try {
        const taskID = req.params.id;
        const query = {"_id": taskID};
        const task = await TaskModel.findOne(query);

        res.status(200).send(task);        
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

taskRouter.post('/tasks', async (req, res) => {
    const task = new Task(req.body);
    try {
        await task.save();
        res.status(201).send(task);
    } catch (error) {
        res.status(500).send(error);
    }
})

taskRouter.delete('/tasks/:id', async (req, res) => {
    try {
        const taskID = req.params.id;
        const query = {"_id": taskID};

        await TaskModel.deleteOne(query);

        res.status(200).send(true);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

module.exports = taskRouter;
