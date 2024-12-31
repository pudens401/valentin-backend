const crypto = require('crypto')
const randomstring = require('randomstring')
require("dotenv").config();

const SECRET = process.env.PASSWORD_SECRET;

const random = () => crypto.randomBytes(128).toString('base64');
const authentication = (salt,password)=>{
    return crypto.createHmac('sha256',[salt,password].join('/')).update(SECRET).digest('hex');
}

const generateOTP = ()=>{
    let OTP =  randomstring.generate({length:6,charset:'numeric'})
    return OTP
}

module.exports = {random,authentication,generateOTP};