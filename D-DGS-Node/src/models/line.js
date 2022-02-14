const mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

const LineSchema = new mongoose.Schema({
    activities: [ObjectId],
    rewards: [ObjectId]
}, {timestamps: true});

const Line = mongoose.model('Line', LineSchema);

module.exports = Line;