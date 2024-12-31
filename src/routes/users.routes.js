const usersController = require('../controllers/users.controller')
const protectionMW  = require('../middlewares/protection')

module.exports = (router)=>{
    router.get('/api/users',usersController.getAllUsers);
    router.get('/api/users/:id',usersController.getOneUserById);
    router.delete('/api/users/:id',usersController.deleteUser);
    router.patch('/api/users/:id',usersController.updateUser);
    router.get('/api/users/secure/:sessionToken',usersController.getOneUserBySessionToken);
}