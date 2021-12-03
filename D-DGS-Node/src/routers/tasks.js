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
        const query = {"_id": taskID}

        await TaskModel.deleteOne(query);

        res.status(200).send(true);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

module.exports = taskRouter;
