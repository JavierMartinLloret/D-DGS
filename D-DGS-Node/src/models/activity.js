const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    name: String | undefined,
    definition: String | undefined
},  {
    timestamps: true
});

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;