const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage location and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Save file with original name + timestamp to avoid overwriting
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filter to only accept images
const fileFilter = (req, file, cb) => {
  // The 'i' makes it case-insensitive (e.g., handles .JPG or .jpeg)
  const allowedTypes = /jpeg|jpg|png/i; 
  
  const extname = allowedTypes.test(path.extname(file.originalname));
  // Postman sometimes doesn't detect the image type properly and sends it as 'application/octet-stream'
  const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'application/octet-stream' || file.mimetype.startsWith('image/');

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    // We pass back exactly what it received so we can debug it!
    cb(new Error(`Upload failed! File extension: ${path.extname(file.originalname)}, Mimetype: ${file.mimetype}`), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10 MB limit
});

module.exports = upload;
