const mongoose = require("mongoose");

const NodeSchema = new mongoose.Schema({
    id: String,
    label: String,
    shape: String,
    color: String
}, {
    timestamps: true
});

const EdgeSchema = new mongoose.Schema({
    id: String,
    from: String,
    to: String,
    label: String,
    arrows: String
}, {
    timestamps : true
});

const SubstrategySchema = new mongoose.Schema({
    name: String,
    nodes: [NodeSchema],
    edges: [EdgeSchema]
}, {
    timestamps: true
});

const ContextSchema = new mongoose.Schema({
    domain_key: String,
    name: String,
},{
    timestamps: true
}
);

const RewardSetSchema = new mongoose.Schema({
    domain_key: String,
    name: String
}, {
    timestamps: true
})

const NodeReferenceSchema = new mongoose.Schema({
    idInDiagram: Number,
    nodeType: String,
    value: String
})

const StrategySchema = new mongoose.Schema({
    domain_key: String,
    name: String,
    description: String,
    domain: ContextSchema,
    reward_set: RewardSetSchema,
    nodes: [NodeSchema],
    edges: [EdgeSchema],
    node_references: [NodeReferenceSchema]
}, {
    timestamps: true
})

const Strategy = mongoose.model('Strategy', StrategySchema);

module.exports = Strategy;