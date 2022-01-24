const mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;


const Activity_TasksSchema = new mongoose.Schema({
    activity: ObjectId,
    tasks:[ObjectId],
}, {timestamps: true});

const Activity_Tasks = mongoose.model('Activity_Tasks', Activity_TasksSchema);

module.exports = Activity_Tasks;