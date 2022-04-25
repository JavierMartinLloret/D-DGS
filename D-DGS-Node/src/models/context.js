const mongoose = require("mongoose");
 
const ContextSchema = new mongoose.Schema({
    domain_key: String,
    name: String,
},{
    timestamps: true
}
);

const Context = mongoose.model('Context', ContextSchema);

module.exports = Context;