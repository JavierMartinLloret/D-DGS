const mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;

const DiagramSchema = new mongoose.Schema({
    domain_key: String,
    lines: [ObjectId]
}, {timestamps: true});

const Diagram = mongoose.model('DiagramSchema', DiagramSchema);

module.exports = Diagram;