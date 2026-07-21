const express = require('express');
const router = express.Router();
const { authLimiter } = require('../middleware/rateLimiter');
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/authController');

router.post('/register', ctrl.register);
router.post('/login', authLimiter, ctrl.login);
router.post('/refresh', ctrl.refreshToken);
router.post('/logout', ctrl.logout);
router.get('/me', protect, ctrl.getMe);
router.patch('/update-profile', protect, ctrl.updateProfile);
router.patch('/update-password', protect, ctrl.updatePassword);

module.exports = router;
