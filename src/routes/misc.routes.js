const miscControllers = require('../controllers/misc.controllers')
const protectionMW  = require('../middlewares/protection')

module.exports = (router) => {
    router.get('/api/db/count',miscControllers.getStats);
}