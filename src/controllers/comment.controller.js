const commentDb = require('../db/Comment')
const {getById} = require('../db/Project')


// Controller function to handle multiple file uploads
const createNewComment = async (req, res) => {
  try {
    const {
      name,
      body,
      projectId
    } = req.body;

    if (!name || !body || !projectId) {
      return res.status(400).json({ success: false, message: 'Required fields missing values' });
    }

    const retrievedProject = await getById(projectId);
    if(!retrievedProject) return res.status(404).json({success:false, message:"Project id not found"})

    const newComment = await commentDb.createComment({
        name,
        body,
        projectId,
        date:new Date()
    });
    retrievedProject.comments.unshift(newComment._id);
    await retrievedProject.save();

    return res.status(201).json({ success: true, message: 'Comment added successfully', data: newComment });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getAllComments = async(req,res)=>{
    try {
        let retrievedComments = await commentDb.getAll();

        let {projectId} = req.query;

        if(projectId){
            retrievedComments = retrievedComments.filter(comment=>comment.projectId===projectId)
        }
        

        return res.status(200).json({success:true,message:'comments retrieved successfully',data:retrievedComments}); 
    } catch (error) {
        return res.status(400).json({success:false,message:error.message}); 
    }
}

const getOneComment = async (req,res)=>{
    try {
        const {id} = req.params;
        if(!id) return res.status(400).json({success:false,message:`no Comment id provided`})
        const retrievedComment = await commentDb.getById(id);
        if(!retrievedComment) return res.status(404).json({success:false,message:`comment with id: ${id} not found`})
        return res.status(200).json({success:true,message:`comment retrieved successfully`,data:retrievedComment})
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}


const updateComment = async (req,res) =>{
    try {
        const {id} = req.params;
        const {
            name,
            body,
          } = req.body;
        if(!id) return res.status(400).json({success:false,message:`No comment id provided`});
        const retrievedComment = await commentDb.getById(id);
        if(!retrievedComment) return res.status(400).json({success:false,message:`innexistent comment`});
        
        const updatedComment = await commentDb.updateById(id,{
            ...(name&&{name}),
            ...(body&&{body})
        })
        if(!updatedComment) return res.status(404).json({success:false,message:`comment with id: ${id} not found`});
        return res.status(202).json({success:true,message:`Comment with id: ${updatedComment._id.toString()} updated successfully`,data:updatedComment});
    } catch (error) {
        return res.status(400).json({success:false,message:error.message});
    }
}



const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({ success: false, message: 'No id provided' });
        }

        // Find the comment to delete
        const deletedComment = await commentDb.deleteById(id);
        if (!deletedComment) {
            return res.status(400).json({ success: false, message: `comment with ID: ${id} does not exist` });
        }

        // remove comment from project
        const retrievedProject = await getById(deletedComment.projectId);
        if(retrievedProject){
            retrievedProject.comments.map( async (commentId,index)=>{
                
                if(commentId==String(deletedComment._id)){
                    retrievedProject.comments.splice(index,1);
                    await retrievedProject.save();
                }
            })
        }

        // Respond with success
        return res.status(200).json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};


module.exports = {
    createNewComment,
    getAllComments,
    getOneComment,
    updateComment,
    deleteComment
}
