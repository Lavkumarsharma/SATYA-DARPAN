const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const ctrl = require('../controllers/categoryController');

router.get('/', ctrl.getAllCategories);
router.get('/:slug', ctrl.getCategoryBySlug);
router.get('/:slug/articles', ctrl.getCategoryArticles);
router.post('/', protect, restrictTo('admin'), ctrl.createCategory);
router.put('/:id', protect, restrictTo('admin'), ctrl.updateCategory);
router.delete('/:id', protect, restrictTo('admin'), ctrl.deleteCategory);

module.exports = router;
