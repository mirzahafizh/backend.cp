const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the 'uploads' folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Set destination folder
  },
  filename: (req, file, cb) => {
    // Set file name with timestamp and original extension
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

// Create multer instance with limits and file filter
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
  },
  fileFilter: (req, file, cb) => {
    // Allow only certain file types
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'));
    }
  }
});

module.exports = upload;
