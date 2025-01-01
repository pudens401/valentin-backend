const protectionMW  = require('../middlewares/protection')
const commentControllers = require('../controllers/comment.controller')

module.exports = (router) => {
    router.post('/api/comments', commentControllers.createNewComment);
    router.get('/api/comments', commentControllers.getAllComments);
    router.get('/api/comments/:id',commentControllers.getOneComment);
    router.delete('/api/comments/:id',commentControllers.deleteComment);
    router.patch('/api/comments/:id',commentControllers.updateComment)
}