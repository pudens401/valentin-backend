const {authentication,random} = require('../helpers/auth.helpers')
const {getUsers,getUserByEmail,getUserById,
    getUserByEmailSecure,getUserByPhone
    ,updateUserByEmail,updateUserById,deleteUserByEmail,deleteUserById,
    createUser,getUserBySessionToken} = require('../db/users');

const getAllUsers = async(req,res)=>{
    try {
        const {email,phone} = req.query;
        if(email&&phone) return res.status(409).json({success:false,message:`Provided multiple potential conflicting queries`});
        if(!email&&phone||email&&!phone){
            const returnedUser = email?await getUserByEmailSecure(email):await getUserByPhone(phone);
            const selectedQuery = email?email:phone;
            if(!returnedUser) return res.status(404).json({success:false,message:`User with ${selectedQuery} not found`});
            return res.status(200).json({success:true,message:`User retrieved successfully`,data:returnedUser});
        }
        const allUsers = await getUsers();
        return res.status(200).json({success:true,message:"Users retrieved successfully",data:allUsers});
    } catch (error) {
        return res.status(400).json({success:false,message:"Bad request",error:error.message});
    }
}

const getOneUserById = async(req,res)=>{
    try {
        const id = req.params.id;
        if(!id) return res.status(400).json({success:false,message:`No user id provided`});
        const returnedUser = await getUserById(id);
        if(!returnedUser) return res.status(404).json({success:false,message:`User with id: ${id} not found`});
        return res.status(200).json({success:true,message:`User retrieved successfully`,data:returnedUser});
    } catch (error) {
        return res.status(400).json({success:false,message:error.message});
    }
}

const getOneUserBySessionToken = async(req,res)=>{
    try {
        const sessionToken = req.params.sessionToken;
        if(!sessionToken) return res.status(400).json({success:false,message:`No user sessionToken provided`});
        const returnedUser = await getUserBySessionToken(sessionToken);
        if(!returnedUser) return res.status(404).json({success:false,message:`User with token: ${sessionToken} not found`});
        return res.status(200).json({success:true,message:`User retrieved successfully`,data:returnedUser});
    } catch (error) {
        return res.status(400).json({success:false,message:error.message});
    }
}

const deleteUser = async(req,res)=>{
    try {
        const id = req.params.id;
        if(!id) return res.status(400).json({success:false,message:`No user id provided`});
        const deletedUser = await deleteUserById(id);
        if(!deletedUser) return res.status(404).json({success:false,message:`User with id: ${id} not found`});
        return res.status(200).json({success:true,message:`User with id: ${deletedUser._id.toString()} deleted successfully`});
    } catch (error) {
        return res.status(400).json({success:false,message:error.message});
    }
}

const updateUser = async (req,res)=>{
    try {
        const id = req.params.id
        const {username,role,phone} = req.body
        if(!id) return res.status(400).json({success:false,message:`No user id provided`});
        const updatedUser = await updateUserById(id,{
            ...(username&&{username}),
            ...(role&&{role}),
            ...(phone&&{phone}),
        });
        
        if(!updatedUser) return res.status(404).json({success:false,message:`User with id: ${id} not found`});
        return res.status(202).json({success:true,message:`User with id: ${updatedUser._id.toString()} updated successfully`,data:updatedUser});
    } catch (error) {
        return res.status(400).json({success:false,message:error.message});
    }
}

module.exports = {getAllUsers,getOneUserById,deleteUser,updateUser,getOneUserBySessionToken}