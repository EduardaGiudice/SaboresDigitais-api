const multer = require('multer')

//definindo storage

const storage = multer.diskStorage({
  destination: function(req, file, callback){
    callback(null, './uploads')
  },
  filename: function(req,file,callback) {
    callback(null,Date.now()+ file.originalname)
  }

})

//upload parametros

const upload = multer({
  storage:storage,
})

module.exports = upload
