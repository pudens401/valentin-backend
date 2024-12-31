const authHelpers = require('../helpers/auth.helpers')
const {getUsers,getUserByEmail,getUserById,
    getUserByPhone
    ,updateUserByEmail,deleteUserByEmail,deleteUserById,
    createUser,getUserBySessionToken,getUserByEmailSecure} = require('../db/users');

const randomstring = require('randomstring')
require('dotenv').config();


const register = async (req,res)=>{
    try {
        const {username,email,phone,password,role} = req.body;
        if(!username||!email||!phone||!password){
            return res.status(401).json({success:false,message:"Please enter all required data",error:"Missing data values"});
        }
        const existingEmail = await getUserByEmailSecure(email)
        const existingPhone = await getUserByPhone(phone)
        if(existingEmail) return res.status(409).json({success:false,message:`user with email: ${email} already exists`})
        if(existingPhone) return res.status(409).json({success:false,message:`user with phone: ${phone} already exists`})
        const newUser = await createUser({
            username:username,
            email:email,
            phone:phone,
            password:password,
            role:role?role:"viewer"
        })
        return res.status(201).json({success:true,message:"User created successfully",data:newUser});
    } catch (error) {
        return res.status(401).json({success:false,message:"Bad request",error:error});
    }
}

const login = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email||!password){
            return res.status(400).json({success:false,message:"Please input both email and password",error:"Missing password or email"});
        }
        const retrievedUser = await getUserByEmail(email);
        if(!retrievedUser){
            return res.status(400).json({success:false,message:"This user does not exist",error:"User not found"});
        }
        if(retrievedUser.password!==password){
            return res.status(401).json({success:false,message:"Incorrect password",error:"Incorrrect password"}); 
        }
        const salt = authHelpers.random();
        retrievedUser.salt = salt;
        retrievedUser.sessionToken = authHelpers.authentication(salt,retrievedUser._id.toString());
        await retrievedUser.save();
        return res.status(200).json({success:true,message:`${retrievedUser.username} has been logged in!`,sessionToken:retrievedUser.sessionToken}); 
    } catch (error) {
        return res.status(400).json({success:false,message:"Bad request",error:error.message});
    }
}

const logout = async(req,res)=>{
    try {
        const {sessionToken} = req.body;
        if(!sessionToken) return res.status(404).json({success:false,message:"You are not logged in",error:"User not logged in"});
        res.status(200).json({success:true,message:"logged out successfully"});
    } catch (error) {
        return res.status(409).json({success:false,message:"Bad request",error:error.message});
    }
}




module.exports = {register,login,logout}



