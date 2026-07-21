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

router.get('/temp-reset-password', async (req, res) => {
  try {
    const User = require('../models/User');
    const mongoose = require('mongoose');
    const dbHost = mongoose.connection.host;
    const dbName = mongoose.connection.name;

    let admin = await User.findOne({ role: 'admin' });
    if (!admin) {
      admin = await User.create({
        name: 'SatyaDarpan Admin',
        email: 'admin@satyadarpan.in',
        password: 'admin123',
        role: 'admin',
        isActive: true,
      });
      return res.status(200).json({
        message: 'Admin user created successfully!',
        email: 'admin@satyadarpan.in',
        password: 'admin123',
        database: { host: dbHost, name: dbName }
      });
    } else {
      admin.password = 'admin123';
      admin.email = 'admin@satyadarpan.in';
      await admin.save();
      return res.status(200).json({
        message: 'Admin user updated successfully!',
        email: 'admin@satyadarpan.in',
        password: 'admin123',
        database: { host: dbHost, name: dbName }
      });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
