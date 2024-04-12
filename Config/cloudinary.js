const cloudinary = require("cloudinary").v2;
require ("dotenv").config()

cloudinary.config({
  cloud_name: "dqeippn06",
  api_key: "785222217297324",
  api_secret: "mdB_KPbmBNfxvQuSUXkc47FfynQ",
});

module.exports = cloudinary ;