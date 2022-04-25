const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    context_ID: String,
    name: String,
    description: String,
},  {
    timestamps: true
});

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;