const mongoose = require("mongoose");

const RewardSetSchema = new mongoose.Schema({
    domain_key: String,
    name: String
}, {
    timestamps: true
})

const RewardSet = mongoose.model('RewardSet', RewardSetSchema);

module.exports = RewardSet;