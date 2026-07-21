const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const { uploadLimiter } = require('../middleware/rateLimiter');
const ctrl = require('../controllers/mediaController');

// Public file serving route — no auth needed (for embedding in articles)
router.get('/file/:id', ctrl.serveFile);

// Protected routes
router.get('/', protect, ctrl.getAllMedia);
router.get('/folders', protect, ctrl.getFolders);
router.post('/upload', protect, uploadLimiter, ctrl.uploadMiddleware, ctrl.uploadMedia);
router.post('/bulk-upload', protect, uploadLimiter, ctrl.bulkUploadMiddleware, ctrl.bulkUpload);
router.post('/bulk-delete', protect, restrictTo('admin', 'editor'), ctrl.bulkDelete);
router.patch('/:id', protect, ctrl.updateMediaMeta);
router.delete('/:id', protect, restrictTo('admin', 'editor'), ctrl.deleteMedia);

module.exports = router;
