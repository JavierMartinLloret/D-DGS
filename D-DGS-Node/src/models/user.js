const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id: Number | undefined,
    nickname: String | undefined,
    email: String | undefined,
    password: String | undefined,
    is_active: Boolean | undefined,
    type_user: Boolean | undefined,
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;