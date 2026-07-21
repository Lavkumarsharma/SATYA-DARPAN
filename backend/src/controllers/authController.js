const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

// Helper: set refresh token in httpOnly cookie
const sendRefreshTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Helper: log action
const logAction = async (action, actor, entity, entityId, details, req) => {
  try {
    await AuditLog.create({
      action,
      actor: actor?._id,
      actorEmail: actor?.email,
      entity,
      entityId,
      details,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
    });
  } catch {
    // Non-blocking
  }
};

// POST /api/auth/register
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  // Only admin can set roles other than viewer
  const assignedRole = req.user?.role === 'admin' ? role : 'viewer';

  const user = await User.create({ name, email, password, role: assignedRole || 'viewer' });
  const { accessToken, refreshToken } = user.generateTokens();

  // Store refresh token
  user.refreshTokens = [refreshToken];
  await user.save({ validateBeforeSave: false });

  sendRefreshTokenCookie(res, refreshToken);
  await logAction('user.register', user, 'User', user._id, { email }, req);

  res.status(201).json({
    success: true,
    data: { accessToken, user: { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar } },
  });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const user = await User.findByEmail(email);
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid email or password', 401));
  }

  if (!user.isActive) {
    return next(new AppError('Your account has been deactivated', 401));
  }

  const { accessToken, refreshToken } = user.generateTokens();

  // Store refresh token (keep last 5)
  user.refreshTokens = [...(user.refreshTokens || []).slice(-4), refreshToken];
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  sendRefreshTokenCookie(res, refreshToken);
  await logAction('user.login', user, 'User', user._id, {}, req);

  const userData = { _id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar, bio: user.bio };

  res.status(200).json({ success: true, data: { accessToken, user: userData } });
});

// POST /api/auth/refresh
exports.refreshToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    return next(new AppError('No refresh token. Please log in.', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decoded.id).select('+refreshTokens');

  if (!user || !user.refreshTokens?.includes(token)) {
    return next(new AppError('Invalid refresh token. Please log in again.', 401));
  }

  const { accessToken, refreshToken: newRefreshToken } = user.generateTokens();

  // Rotate refresh token
  user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
  user.refreshTokens.push(newRefreshToken);
  await user.save({ validateBeforeSave: false });

  sendRefreshTokenCookie(res, newRefreshToken);

  res.status(200).json({ success: true, data: { accessToken } });
});

// POST /api/auth/logout
exports.logout = asyncHandler(async (req, res, next) => {
  const token = req.cookies.refreshToken;

  if (token && req.user) {
    const user = await User.findById(req.user._id).select('+refreshTokens');
    if (user) {
      user.refreshTokens = (user.refreshTokens || []).filter((t) => t !== token);
      await user.save({ validateBeforeSave: false });
    }
  }

  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// GET /api/auth/me
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, data: user });
});

// PATCH /api/auth/update-profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'bio', 'avatar', 'socialLinks'];
  const updates = {};
  allowed.forEach((field) => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.status(200).json({ success: true, data: user });
});

// PATCH /api/auth/update-password
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect', 401));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ success: true, message: 'Password updated successfully' });
});
