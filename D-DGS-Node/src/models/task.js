const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    domain_key: String,
    name: String,
    description: String
},  {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;