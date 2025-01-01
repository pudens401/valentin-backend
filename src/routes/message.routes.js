const protectionMW  = require('../middlewares/protection')
const messageControllers = require('../controllers/message.controller')

module.exports = (router) => {
    router.post('/api/messages', messageControllers.createNewMessage);
    router.get('/api/messages', messageControllers.getAllMessages);
    router.get('/api/messages/:id',messageControllers.getOneMessage);
    router.delete('/api/messages/:id',messageControllers.deleteMessage);
    router.patch('/api/messages/:id',messageControllers.updateMessage)
}