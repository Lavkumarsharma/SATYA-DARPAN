const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const ctrl = require('../controllers/analyticsController');

router.get('/dashboard', protect, restrictTo('admin', 'editor'), ctrl.getDashboardStats);
router.get('/views-trend', protect, restrictTo('admin', 'editor'), ctrl.getViewsTrend);
router.get('/top-articles', protect, restrictTo('admin', 'editor'), ctrl.getTopArticles);
router.post('/track', ctrl.trackView);

module.exports = router;
