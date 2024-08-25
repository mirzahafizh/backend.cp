// middleware/uploads.js
const multer = require('multer');
const path = require('path');

// Setup storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Set the destination for file uploads
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`); // Set the filename with a timestamp
  }
});

// Initialize upload middleware
const upload = multer({ storage });

module.exports = { upload };
