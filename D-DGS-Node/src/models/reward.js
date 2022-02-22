const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema({
    domain_key: String,
    name: String,
    description: String
},  {
    timestamps: true
});

const Reward = mongoose.model('Reward', RewardSchema);

module.exports = Reward;