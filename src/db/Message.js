const {Schema, model} = require('mongoose')

const MessageSchema = new Schema({
    name:{type:String, required:true},
    body:{type:String, required:true},
    date:{type:String, required:true},
    email:{type:String, required:true},
    phone:{type:String, required:true},
    isRead:{type:Boolean, default:false}
})

const MessageModel = model('Message', MessageSchema);

const createMessage = async (data) => {
    const newMessage = new MessageModel(data);
    await newMessage.save();
    return newMessage.toObject();
}
const getAll = async () => await MessageModel.find()
const getById = async (id) => await MessageModel.findById(id)
const deleteById = async (id) => await MessageModel.findByIdAndDelete(id)
const updateById = async (id, data) => {
    const updatedMessage = await MessageModel.findByIdAndUpdate(id,data);
    return MessageModel.findById(id);
}

module.exports = {
    createMessage,
    getAll,
    getById,
    deleteById,
    updateById
}