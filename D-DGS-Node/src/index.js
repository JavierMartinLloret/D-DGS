//  npm run dev To start

const express = require("express");
const userRouter = require('./routers/user');
const contextRouter = require('./routers/context');
const activityRouter = require('./routers/activity');
const activityPropertyRouter = require('./routers/activity_property');
const rewardSetRouter = require('./routers/reward_set');
const rewardRouter = require('./routers/reward');
const diagramRouter = require('./routers/diagram');
const linkerRouter = require('./routers/linker');
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
app.use(activityPropertyRouter);
app.use(rewardSetRouter);
app.use(rewardRouter);
app.use(diagramRouter);
app.use(linkerRouter);

app.listen(3000, () =>{
    console.log('Express server running on the port 3000');
})