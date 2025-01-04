const {getAll:comments} = require('../db/Comment')
const {getAll:messages} = require('../db/Message')
const {getAll:projects} = require('../db/Project')

const getStats = async (req,res) => {
    try {
        const commentArr = await comments();
        const messageArr = await messages();
        const projectArr = await projects();

        const countObj = {
            commentsCount:commentArr.length,
            messagesCount:messageArr.length,
            projectsCount:projectArr.length
        }

        return res.status(200).json({success:true, data:countObj, message:'Counts retrieved successfully'});
    } catch (error) {
        return res.status(400).json({success:false, message:error.message});
    }

}

module.exports = {getStats}