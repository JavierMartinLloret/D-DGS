const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    nickname: String,
    email: String,
    password: String,
    domainIdentificator: String,
    is_admin: Boolean
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;