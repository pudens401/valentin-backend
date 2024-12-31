const express = require('express')
const router = express.Router();

const userRoutes = require('./users.routes')
const authRoutes = require('./auth.routes')

module.exports = ()=>{
    const userRoutes = require('./users.routes')
    const authRoutes = require('./auth.routes')
    return router;
}