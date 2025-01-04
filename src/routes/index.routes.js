const express = require('express')
const router = express.Router();

const userRoutes = require('./users.routes')
const authRoutes = require('./auth.routes')
const projectRoutes = require('./project.routes');
const commentRoutes = require('./comment.routes');
const messageRoutes = require('./message.routes') 
const miscRoutes = require('./misc.routes')


module.exports = ()=>{
    userRoutes(router);
    authRoutes(router);
    projectRoutes(router);
    commentRoutes(router);
    messageRoutes(router);
    miscRoutes(router);
    return router;
}