const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    name: String,
    description: String,
    // One activity is related with one or may tasks...
    tasks:
    [
        {
            _idTask: mongoose.Schema.Types.ObjectId,
            name: String,
            description: String
        }
    ],
},  {
    timestamps: true
});

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;