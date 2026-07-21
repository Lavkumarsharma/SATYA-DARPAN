const Newsletter = require('../models/Newsletter');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

exports.subscribe = asyncHandler(async (req, res) => {
  const { email, name } = req.body;
  if (!email) return next(new AppError('Email is required', 400));

  const existing = await Newsletter.findOne({ email });
  if (existing) {
    if (existing.status === 'unsubscribed') {
      existing.status = 'active';
      existing.subscribedAt = new Date();
      await existing.save();
      return res.status(200).json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
    }
    return res.status(200).json({ success: true, message: 'You are already subscribed.' });
  }

  await Newsletter.create({ email, name });
  res.status(201).json({ success: true, message: 'Thank you for subscribing!' });
});

exports.unsubscribe = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const subscriber = await Newsletter.findOne({ email });
  if (!subscriber) return next(new AppError('Subscriber not found', 404));
  subscriber.status = 'unsubscribed';
  subscriber.unsubscribedAt = new Date();
  await subscriber.save();
  res.status(200).json({ success: true, message: 'You have been unsubscribed.' });
});

exports.getAllSubscribers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const skip = (Number(page) - 1) * Number(limit);
  const [subscribers, total] = await Promise.all([
    Newsletter.find(filter).sort('-subscribedAt').skip(skip).limit(Number(limit)).lean(),
    Newsletter.countDocuments(filter),
  ]);
  res.status(200).json({ success: true, data: subscribers, pagination: { total, page: Number(page), limit: Number(limit) } });
});
