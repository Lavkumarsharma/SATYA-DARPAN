const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const ctrl = require('../controllers/sectionController');

// Public endpoints
router.get('/', ctrl.getSections);
router.get('/:key', ctrl.getSectionByKey);

// Admin edit endpoints
router.use(protect);
router.put('/:key', restrictTo('admin', 'editor'), ctrl.updateSection);

module.exports = router;
