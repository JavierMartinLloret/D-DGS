const mongoose = require("mongoose");

const NodeSchema = new mongoose.Schema({
    idInDiagram: String,
    label: String,
    type: String,
    shape: String,
    color: String,
    base_element_id: String
}, {
    timestamps: true
});

const EdgeSchema = new mongoose.Schema({
    idInDiagram: String,
    from: String,
    to: String,
    arrows: String,
    value: Number
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

const StrategySchema = new mongoose.Schema({
    domain_key: String,
    name: String,
    description: String,
    domain: ContextSchema,
    reward_set: RewardSetSchema,
    substrategies: [SubstrategySchema]
}, {
    timestamps: true
})

const Strategy = mongoose.model('Strategy', StrategySchema);

module.exports = Strategy;