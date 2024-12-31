const authControllers = require('../controllers/auth.controller')
const protectionMW  = require('../middlewares/protection')

module.exports = (router) => {
    router.post('/api/auth/register',authControllers.register);
    router.post('/api/auth/login',authControllers.login);
    router.post('/api/auth/logout',protectionMW.isLogged,authControllers.logout);
}