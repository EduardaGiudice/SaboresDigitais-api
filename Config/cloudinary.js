const cloudinary = require("cloudinary").v2;
require ("dotenv").config()

// Configura as credenciais do Cloudinary utilizando variáveis de ambiente
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

module.exports = cloudinary ;
