const mongoose = require('mongoose');  // Import the mongoose library

const UserSchema = new mongoose.Schema({
    username:String,
    email:String,
    phone:String,
    role:{type:String,default:"viewer"},
    password:{type:String,select:false},    // This prevents the db to select the password whn one gets users
    sessionToken:{type:String,select:false},
    salt:{type:String,select:false}
});       

const UserModel = mongoose.model('user',UserSchema);  // Creating document model based on the schema

const getUsers = async ()=> await UserModel.find();
const getUserByEmail = async(email)=> await UserModel.findOne({email}).select('+password');
const getUserById = async(id)=> await UserModel.findById({_id:id});
const getUserByEmailSecure = async(email)=> await UserModel.findOne({email:email});
const getUserByPhone = async(phone)=> await UserModel.findOne({phone:phone});
const getUserBySessionToken = async (sessionToken)=> await UserModel.findOne({sessionToken}).select('+sessionToken +contact.email +contact.telephone')
const updateUserByEmail = async(email,values)=>{
    const updatedUser = await UserModel.findOneAndUpdate(email,values)
    return UserModel.findById(id);
};
const updateUserById = async (id,values) =>{
    const updatedUser = await UserModel.findByIdAndUpdate(id,values)
    return await UserModel.findById(id);
};
const deleteUserByEmail = async (email)=> await UserModel.findOneAndDelete({email});
const deleteUserById = async (id)=> await UserModel.findByIdAndDelete(id);
const createUser = async(values)=>{
    const newUser = new UserModel(values);
    await newUser.save();
    const newUserObject = newUser.toObject();
    delete newUserObject.password;
    return newUserObject;
}

module.exports = {getUsers,getUserByEmail,getUserById,
    getUserByEmailSecure,getUserByPhone
    ,deleteUserByEmail,deleteUserById,
    createUser,getUserBySessionToken,
    updateUserByEmail,updateUserById};
