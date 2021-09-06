//  npm run dev To start

const express = require("express");
const userRouter = require('./routers/user');
const mongoose = require('./db/mongoose');


const app = express();

app.use(express.json());

app.use(userRouter);

app.listen(3000, () =>{
    console.log('Express server running on the port 3000');
})