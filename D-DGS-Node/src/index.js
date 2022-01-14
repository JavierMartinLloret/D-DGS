//  npm run dev To start

const express = require("express");
const userRouter = require('./routers/user');
const activityRouter = require('./routers/activity');
const taskRouter = require('./routers/tasks');
const rewarRouter = require('./routers/reward');
const mongoose = require('./db/mongoose');


const app = express();

app.use(express.json());

var cors = require('cors');
app.use(cors());

app.all('/*', (req, res, next) => {
    //Enable CORS policy so we can make http request between the node and ng app
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Method', 'GET, PUT, POST, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Autorization, Content-Length, X-Requested-With');
    next();
})

app.use(userRouter);
app.use(activityRouter);
app.use(taskRouter);
app.use(rewarRouter);

app.listen(3000, () =>{
    console.log('Express server running on the port 3000');
})