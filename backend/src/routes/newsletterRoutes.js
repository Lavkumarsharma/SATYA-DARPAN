const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const ctrl = require('../controllers/newsletterController');

router.post('/subscribe', ctrl.subscribe);
router.post('/unsubscribe', ctrl.unsubscribe);
router.get('/subscribers', protect, restrictTo('admin'), ctrl.getAllSubscribers);

module.exports = router;
