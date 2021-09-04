const express = require("express");
const mongoose = require('./db/mongoose');


const app = express();

app.listen(3000, () =>{
    console.log('Express server running on the port 3000');
})