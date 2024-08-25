// middlewares/upload.js
const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Menyimpan file di folder 'uploads'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Menambahkan timestamp ke nama file
    }
});

const upload = multer({ storage });

module.exports = upload;
