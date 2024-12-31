const express = require('express')
const router = express.Router();

const userRoutes = require('./users.routes')
const authRoutes = require('./auth.routes')
const projectRoutes = require('./project.routes')

module.exports = ()=>{
    userRoutes(router);
    authRoutes(router);
    projectRoutes(router);
    return router;
}