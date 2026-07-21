const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const ctrl = require('../controllers/tagController');

router.get('/', ctrl.getAllTags);
router.post('/', protect, restrictTo('admin', 'editor'), ctrl.createTag);
router.put('/:id', protect, restrictTo('admin', 'editor'), ctrl.updateTag);
router.delete('/:id', protect, restrictTo('admin'), ctrl.deleteTag);

module.exports = router;
