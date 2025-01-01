const {Schema, model} = require('mongoose');

const CommentSchema = new Schema({
    name:{type:String, required:true},
    body:{type:String, required:true},
    date:{type:String, required:true},
    projectId:{type:String, required:true}
});

const CommentModel = model('Comment', CommentSchema);

const createComment = async (data) => {
    const newComment = new CommentModel(data);
    await newComment.save();
    return newComment.toObject();
};
const getAll = async () => await CommentModel.find();
const getById = async (id) => await CommentModel.findById(id);
const getByProject = async (projectId) => await CommentModel.find({projectId:projectId});
const deleteById = async (id) => await CommentModel.findByIdAndDelete(id);
const updateById = async (id, data) => {
    const updatedComment = await CommentModel.findByIdAndUpdate(id,data);
    return CommentModel.findById(id);
};

module.exports = {
    createComment,
    getAll,
    getById,
    deleteById,
    updateById,
    getByProject
};