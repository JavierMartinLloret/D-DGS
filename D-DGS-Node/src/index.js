//  npm run dev To start

const express = require("express");
const userRouter = require('./routers/user');
const contextRouter = require('./routers/context');
const activityRouter = require('./routers/activity');
const taskRouter = require('./routers/tasks');
const rewardRouter = require('./routers/reward');
const activity_tasksRouter = require('./routers/activity_tasks');
const lineRouter = require('./routers/line');
const diagramRouter = require('./routers/diagram');
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
app.use(contextRouter);
app.use(activityRouter);
app.use(taskRouter);
app.use(rewardRouter);
app.use(activity_tasksRouter);
app.use(lineRouter);
app.use(diagramRouter);


app.listen(3000, () =>{
    console.log('Express server running on the port 3000');
})