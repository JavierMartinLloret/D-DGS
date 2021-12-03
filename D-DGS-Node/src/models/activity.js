const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    name: String,
    description: String,
    // One activity is related with one or may tasks...
    tasks:
    [
        {
            type: mongoose.Schema.Types.ObjectId , ref: 'Task'
        }
    ],
},  {
    timestamps: true
});

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;