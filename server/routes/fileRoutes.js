const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fileController = require('../controllers/fileController');

// נתיב שמירה לקבצים
const uploadDir = path.join(__dirname, '../uploadFiles');

// Configure multer for uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// CRUD routes
router.get('/', fileController.getAllFiles);
router.get('/:id', fileController.getFileById);
router.get('/child/:childId', fileController.getFilesByChildId);

// POST עם multer כדי לקבל קובץ
router.post('/', upload.single('file'), fileController.addFile);

router.put('/:id', fileController.updateFile);
router.delete('/:id', fileController.deleteFile);

module.exports = router;
