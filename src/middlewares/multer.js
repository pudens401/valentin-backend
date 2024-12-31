const multer = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './src/uploads'); // Temporary storage before Cloudinary upload
  },
    filename:function(req,file,cb){
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({storage:storage});

module.exports =  {upload}