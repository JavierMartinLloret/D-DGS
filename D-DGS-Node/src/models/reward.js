const mongoose = require("mongoose");

const RewardSchema = new mongoose.Schema({
    name: String,
    description: String
},  {
    timestamps: true
});

const Reward = mongoose.model('Reward', RewardSchema);

module.exports = Reward;