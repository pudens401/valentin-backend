const {Schema, model} = require('mongoose')

const ProjectSchema = new Schema({
    name:{type:String, required:true},
    description:{type:String,required:true},
    type:{type:String,required:true},
    bedrooms:{type:Number, required:true},
    bathrooms:{type:Number, required:true},
    images:[
        {
            url:{type:String,required:true},
            public_id:{type:String,required:true}
        }
    ],
    comments:{type:Array,default:[]}
})

const ProjectModel = model('Project',ProjectSchema)

const createProject = async (data) => {
    const newProject = new ProjectModel(data);
    await newProject.save();
    return newProject.toObject();
}
const getAll = async () => await ProjectModel.find()
const getById = async (id) => await ProjectModel.findById(id)
const deleteById = async (id) => await ProjectModel.findByIdAndDelete(id)
const updateById = async (id, data) => {
    const updatedProject = await ProjectModel.findByIdAndUpdate(id,data);
    return ProjectModel.findById(id);
}

module.exports = {
    createProject,
    getAll,
    getById,
    deleteById,
    updateById
}