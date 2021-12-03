const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    // A task is related with one activity
    activity: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Activity'
    }
},  {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;