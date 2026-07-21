const User = require('../models/User');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

exports.getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role } = req.query;
  const filter = {};
  if (role) filter.role = role;
  const skip = (Number(page) - 1) * Number(limit);
  const [users, total] = await Promise.all([
    User.find(filter).sort('-createdAt').skip(skip).limit(Number(limit)).lean(),
    User.countDocuments(filter),
  ]);
  res.status(200).json({ success: true, data: users, pagination: { total, page: Number(page), limit: Number(limit) } });
});

exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({ success: true, data: user });
});

exports.createUser = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json({ success: true, data: user });
});

exports.updateUser = asyncHandler(async (req, res, next) => {
  const allowed = ['name', 'email', 'role', 'bio', 'avatar', 'isActive', 'socialLinks'];
  const updates = {};
  allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
  const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  await user.deleteOne();
  res.status(204).json({ success: true, data: null });
});

exports.updateRole = asyncHandler(async (req, res, next) => {
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({ success: true, data: user });
});
