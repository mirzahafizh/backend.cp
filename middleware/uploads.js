// middleware/uploads.js
const multer = require('multer');
const path = require('path');

// Define storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads')); // Save files to the 'uploads' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use original file name
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage });

module.exports = upload;
