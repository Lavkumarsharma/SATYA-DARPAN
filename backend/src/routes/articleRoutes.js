const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const ctrl = require('../controllers/articleController');

// Public routes
router.get('/', ctrl.getPublishedArticles);
router.get('/featured', ctrl.getFeaturedArticles);
router.get('/trending', ctrl.getTrendingArticles);
router.get('/editors-picks', ctrl.getEditorsPicks);
router.get('/fact-checks', ctrl.getFactChecks);
router.get('/slug/:slug', ctrl.getArticleBySlug);   // explicit /slug/:slug for frontend
router.get('/:slug', ctrl.getArticleBySlug);
router.get('/:id/related', ctrl.getRelatedArticles);

// Admin/editor routes
router.use(protect);
router.get('/admin/all', restrictTo('admin', 'editor'), ctrl.getAllArticles);
router.get('/admin/:id', restrictTo('admin', 'editor'), ctrl.getArticleById);
router.post('/', restrictTo('admin', 'editor', 'author'), ctrl.createArticle);
router.put('/:id', restrictTo('admin', 'editor', 'author'), ctrl.updateArticle);
router.patch('/:id/publish', restrictTo('admin', 'editor'), ctrl.publishArticle);
router.patch('/:id/unpublish', restrictTo('admin', 'editor'), ctrl.unpublishArticle);
router.delete('/:id', restrictTo('admin'), ctrl.deleteArticle);
router.get('/:id/revisions', restrictTo('admin', 'editor'), ctrl.getRevisions);
router.post('/:id/restore/:revisionId', restrictTo('admin', 'editor'), ctrl.restoreRevision);

module.exports = router;
