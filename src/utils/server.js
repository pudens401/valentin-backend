const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const routes = require('../routes/index.routes')
require("dotenv").config();

const createServer = () =>{
    const app = express()
    app.use(express.json({limit:'100mb'}))
    app.use(express.urlencoded({limit:'100mb',extended:true}))
    app.use(cors({credentials:true}))
    app.use(bodyParser.json())
    app.use('/',routes())
    return app
}

const connectDb = async ()=>{
    try {
        const dbConnectString = process.env.DBCONNECTSTRING
        await mongoose.connect(dbConnectString)
        console.log("Connected to database successfully")
    } catch (err) {
        console.log("Connection failed:"+err.message)
    }
}

module.exports = {createServer,connectDb}