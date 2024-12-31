const protectionMW  = require('../middlewares/protection')
const projectControllers = require('../controllers/project.controller')
const {upload} = require('../middlewares/multer')

module.exports = (router) => {
    router.post('/api/projects', upload.array('images', 10), projectControllers.createNewProject);
    router.get('/api/projects', projectControllers.getAllProjects);
    router.get('/api/projects/:id',projectControllers.getOneProject);
    router.delete('/api/projects/:id',projectControllers.deleteProject);
    router.patch('/api/projects/:id',projectControllers.updateProject)
}