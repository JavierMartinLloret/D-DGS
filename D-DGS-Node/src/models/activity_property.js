const mongoose = require("mongoose");

const ActivityPropertySchema = new mongoose.Schema({
    activity_ID: String,
    name: String,
    value_Number: Number,
    value_String: String,
    value_Date: Date
}, {
    timestamps : true
});

const ActivityProperty = mongoose.model('ActivityProperty', ActivityPropertySchema);

module.exports = ActivityProperty;