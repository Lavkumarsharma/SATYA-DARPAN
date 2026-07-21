const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/auth');
const ctrl = require('../controllers/userController');

router.use(protect, restrictTo('admin'));
router.get('/', ctrl.getAllUsers);
router.get('/:id', ctrl.getUserById);
router.post('/', ctrl.createUser);
router.put('/:id', ctrl.updateUser);
router.patch('/:id/role', ctrl.updateRole);
router.delete('/:id', ctrl.deleteUser);

module.exports = router;
