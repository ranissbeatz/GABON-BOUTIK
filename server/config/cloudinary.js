const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists if using local storage
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure storage based on environment
// If Cloudinary creds are missing, fallback to local storage (for dev)
const storage = (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) 
  ? new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: 'ganon_boutik',
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
        transformation: [{ width: 1000, height: 1000, crop: 'limit' }], // Basic optimization
      },
    })
  : multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
      },
    });

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Images Only!'));
    }
  }
});

module.exports = { cloudinary, upload };
