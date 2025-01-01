const projectDb = require('../db/Project')
const commentDb = require('../db/Comment')
const {cloudinary} = require('../utils/cloudinary.config')


// Controller function to handle multiple file uploads
const createNewProject = async (req, res) => {
  try {
    const {
      name,
      description,
      type,
      bedrooms,
      bathrooms,
    } = req.body;

    if (!name || !description || !type|| !bedrooms || !bathrooms) {
      return res.status(400).json({ success: false, message: 'Required fields missing values' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    // Upload files to Cloudinary
    const uploadResults = await Promise.all(
      req.files.map(file =>
        cloudinary.uploader.upload(file.path, { folder: 'project_images' })
      )
    );

    // Structure the uploaded images
    const images = uploadResults.map(upload => ({
      url: upload.secure_url,
      public_id: upload.public_id
    }));


    const newProject = await projectDb.createProject({
        name,
        description,
        type,
        bedrooms,
        bathrooms,
        images
    });

    return res.status(201).json({ success: true, message: 'Project added successfully', data: newProject });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getAllProjects = async(req,res)=>{
    try {
        let retrievedProjects = await projectDb.getAll();
        return res.status(200).json({success:true,message:'Projects retrieved successfully',data:retrievedProjects}); 
    } catch (error) {
        return res.status(400).json({success:false,message:error.message}); 
    }
}

const getOneProject = async (req,res)=>{
    try {
        const {id} = req.params;
        if(!id) return res.status(400).json({success:false,message:`no project id provided`})
        const retrievedProject = await projectDb.getById(id);
        if(!retrievedProject) return res.status(404).json({success:false,message:`Project with id: ${id} not found`})
        return res.status(200).json({success:true,message:`Project returned successfully`,data:retrievedProject})
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}

const updateProject = async (req,res) =>{
    try {
        const {id} = req.params;
        const {
            name,
            description,
            type,
            bedrooms,
            bathrooms,
          } = req.body;
        if(!id) return res.status(400).json({success:false,message:`No project id provided`});
        const retrievedProject = await projectDb.getById(id);
        if(!retrievedProject) return res.status(400).json({success:false,message:`innexistent Project`});
        
        const updatedProject = await projectDb.updateById(id,{
            ...(name&&{name}),
            ...(type&&{type}),
            ...(bedrooms&&{bedrooms}),
            ...(bathrooms&&{bathrooms}),
            ...(description&&{description})
        })
        if(!updatedProject) return res.status(404).json({success:false,message:`Project with id: ${id} not found`});
        return res.status(202).json({success:true,message:`Project with id: ${updatedProject._id.toString()} updated successfully`,data:updatedProject});
    } catch (error) {
        return res.status(400).json({success:false,message:error.message});
    }
}

const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({ success: false, message: 'No project ID provided' });
        }

        // Find the project to delete
        const deletedProject = await projectDb.deleteById(id);
        if (!deletedProject) {
            return res.status(400).json({ success: false, message: `Project with ID: ${id} does not exist` });
        }

        // Check if the project has images
        if (!deletedProject.images || deletedProject.images.length === 0) {
            return res.status(200).json({ success: true, message: "Project deleted successfully, no images to delete." });
        }

        // Collect image public IDs
        const imagePublicIds = deletedProject.images.map(image => image.public_id);

        // Delete images from Cloudinary
        const deletionResults = await Promise.all(
            imagePublicIds.map(public_id => cloudinary.uploader.destroy(public_id))
        );

        // Check for any failures in the deletion process
        const failedDeletions = deletionResults.filter(result => result.result !== 'ok');
        if (failedDeletions.length > 0) {
            return res.status(500).json({ 
                success: false, 
                message: 'Some images could not be deleted from Cloudinary', 
                failedImages: failedDeletions 
            });
        }

        deletedProject.comments.map(async (comment) => {
            await commentDb.deleteById(comment)
        })

        // Respond with success
        return res.status(200).json({ success: true, message: "Project and associated images deleted successfully" });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};


module.exports = {
    createNewProject,
    getAllProjects,
    getOneProject,
    updateProject,
    deleteProject
}
