const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// setting up cloudinary config
cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_KEY,
   api_secret: process.env.CLOUDINARY_SECRET,
});

// setting up an instance of cloudinary storage in this file
const storage = new CloudinaryStorage({
   cloudinary,
   params: {
      folder: "CAMPEX_Campgrounds",
      allowedFormats: ["jpeg", "png", "jpg"],
   },
});

// exporting
module.exports = { cloudinary, storage };
