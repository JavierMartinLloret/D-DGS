const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema({
    parent_set: String,
    name: String,
    description: String,
    priority: Number
},  {
    timestamps: true
});

const Reward = mongoose.model('Reward', RewardSchema);

module.exports = Reward;