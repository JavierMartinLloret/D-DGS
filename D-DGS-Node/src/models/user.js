const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nickname: String,
    email: String,
    password: String,
    domainIdentificator: String
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;