const messageDb = require('../db/Message')


// Controller function to handle multiple file uploads
const createNewMessage = async (req, res) => {
  try {
    const {
      name,
      body,
      email,
      phone
    } = req.body;
    console.log(req.body);

    if (!name || !body || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Required fields missing values' });
    }

    const newMessage = await messageDb.createMessage({
        name,
        body,
        email,
        phone,
        date:new Date()
    });

    return res.status(201).json({ success: true, message: 'message added successfully', data: newMessage });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const getAllMessages = async(req,res)=>{
    try {
        let retrievedMessages = await messageDb.getAll();

        return res.status(200).json({success:true,message:'messages retrieved successfully',data:retrievedMessages}); 
    } catch (error) {
        return res.status(400).json({success:false,message:error.message}); 
    }
}

const getOneMessage = async (req,res)=>{
    try {
        const {id} = req.params;
        if(!id) return res.status(400).json({success:false,message:`no message id provided`})
        const retrievedMessage = await messageDb.getById(id);
        if(!retrievedMessage) return res.status(404).json({success:false,message:`Message with id: ${id} not found`})
        return res.status(200).json({success:true,message:`message retrieved successfully`,data:retrievedMessage})
    } catch (error) {
        return res.status(400).json({success:false,message:error.message})
    }
}

const updateMessage = async (req,res) =>{
    try {
        const {id} = req.params;
        const {
            name,
            body,
            email,
            phone,
            isRead
          } = req.body;
        if(!id) return res.status(400).json({success:false,message:`No message id provided`});
        const retrievedMessage = await messageDb.getById(id);
        if(!retrievedMessage) return res.status(400).json({success:false,message:`innexistent message`});
        
        const updatedMessage = await messageDb.updateById(id,{
            ...(name&&{name}),
            ...(body&&{body}),
            ...(email&&{email}),
            ...(phone&&{phone}),
            ...(isRead&&{isRead})
        })
        if(!updatedMessage) return res.status(404).json({success:false,message:`message with id: ${id} not updated`});
        return res.status(202).json({success:true,message:`m with id: ${updatedMessage._id.toString()} updated successfully`,data:updatedMessage});
    } catch (error) {
        return res.status(400).json({success:false,message:error.message});
    }
}



const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).json({ success: false, message: 'No id provided' });
        }

        // Find the Message to delete
        const deletedMessage = await messageDb.deleteById(id);
        if (!deletedMessage) {
            return res.status(400).json({ success: false, message: `Message with ID: ${id} does not exist` });
        }

        // Respond with success
        return res.status(200).json({ success: true, message: "message deleted successfully" });
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
};


module.exports = {
    createNewMessage,
    getAllMessages,
    getOneMessage,
    updateMessage,
    deleteMessage
}
