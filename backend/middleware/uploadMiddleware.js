const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = uploadsDir;
    
    // Create subdirectories based on file type
    if (file.fieldname === 'images') {
      uploadPath = path.join(uploadsDir, 'images');
    } else if (file.fieldname === 'floorPlans') {
      uploadPath = path.join(uploadsDir, 'floorplans');
    } else if (file.fieldname === 'videos') {
      uploadPath = path.join(uploadsDir, 'videos');
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'images') {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for property images'), false);
    }
  } else if (file.fieldname === 'floorPlans') {
    // Accept images and PDFs for floor plans
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed for floor plans'), false);
    }
  } else if (file.fieldname === 'videos') {
    // Accept only video files
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed for video tours'), false);
    }
  } else {
    cb(new Error('Unknown file field'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
    files: 20 // Maximum 20 files total
  }
});

// Middleware for handling multiple file types
const uploadFields = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'floorPlans', maxCount: 5 },
  { name: 'videos', maxCount: 3 }
]);

module.exports = { uploadFields, uploadsDir };