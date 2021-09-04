const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/D-DGS",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() =>{
    console.log("Connection with DB established")
}).catch(error => {
    console.log("Unnable to connect with BD");
})