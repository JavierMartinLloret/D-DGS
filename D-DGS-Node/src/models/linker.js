const mongoose = require("mongoose");

const LinkerSchema = new mongoose.Schema({
    name: String,
    category: String
}, {
    timestamps : true
});

const Linker = mongoose.model('Linker', LinkerSchema);

module.exports = Linker;