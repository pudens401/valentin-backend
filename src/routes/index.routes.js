const express = require('express')
const router = express.Router();

const userRoutes = require('./users.routes')
const authRoutes = require('./auth.routes')

module.exports = ()=>{
    userRoutes(router);
    authRoutes(router);
    return router;
}