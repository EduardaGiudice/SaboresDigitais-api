const multer = require('multer')

// Define o storage (local onde os arquivos serão armazenados)
const storage = multer.diskStorage({
  // Define o nome do arquivo que será salvo no disco

  filename: function (req, file, callback) {
    // O nome do arquivo será uma combinação do timestamp atual e o nome original do arquivo
    callback(null, Date.now() + file.originalname);
  },
});

// Configuração do upload utilizando o multer, passando o storage definido acima
const upload = multer({
  storage:storage,
})

module.exports = upload
