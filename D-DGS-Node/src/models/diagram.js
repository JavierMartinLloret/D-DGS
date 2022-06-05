const mongoose = require("mongoose");

const nodeSchema = new mongoose.Schema({
    id: String,
    label: String,
    type: String,
    shape: String,
    color: String,
    base_element_id: String,
});

const edgeSchema = new mongoose.Schema({
    id: String,
    from: String,
    to: String,
    arrows: String,
    value: Number
});

const DiagramSchema = new mongoose.Schema({
    domain_key: String,
    name: String,
    nodes: [nodeSchema],
    edges: [edgeSchema]
}, {timestamps: true});

const Diagram = mongoose.model('DiagramSchema', DiagramSchema);

module.exports = Diagram;