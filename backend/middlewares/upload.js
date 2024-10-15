const multer = require('multer');
const path = require('path');

// Define storage for uploaded images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads/categories'); // Ensure this directory exists
  },
  filename: function (req, file, cb) {
    // Create a unique filename using the current timestamp and original name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// File filter to allow only image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images are allowed (jpeg, jpg, png, gif)'));
  }
};

// Initialize multer with storage and file filter
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  fileFilter: fileFilter,
});

module.exports = upload;
