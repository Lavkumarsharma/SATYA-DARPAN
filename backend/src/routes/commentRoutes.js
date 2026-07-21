const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const ctrl = require('../controllers/commentController');

router.post('/', ctrl.createComment);
router.get('/article/:articleId', ctrl.getCommentsByArticle);
router.get('/', protect, restrictTo('admin', 'editor'), ctrl.getAllComments);
router.patch('/:id/approve', protect, restrictTo('admin', 'editor'), ctrl.approveComment);
router.patch('/:id/reject', protect, restrictTo('admin', 'editor'), ctrl.rejectComment);
router.patch('/:id/spam', protect, restrictTo('admin', 'editor'), ctrl.markSpam);
router.patch('/:id/pin', protect, restrictTo('admin', 'editor'), ctrl.pinComment);
router.delete('/:id', protect, restrictTo('admin'), ctrl.deleteComment);

module.exports = router;
