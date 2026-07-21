const Tag = require('../models/Tag');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

exports.getAllTags = asyncHandler(async (req, res) => {
  const tags = await Tag.find().sort('-articleCount').lean();
  res.status(200).json({ success: true, data: tags });
});

exports.createTag = asyncHandler(async (req, res) => {
  const tag = await Tag.create(req.body);
  res.status(201).json({ success: true, data: tag });
});

exports.updateTag = asyncHandler(async (req, res, next) => {
  const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!tag) return next(new AppError('Tag not found', 404));
  res.status(200).json({ success: true, data: tag });
});

exports.deleteTag = asyncHandler(async (req, res, next) => {
  const tag = await Tag.findById(req.params.id);
  if (!tag) return next(new AppError('Tag not found', 404));
  await tag.deleteOne();
  res.status(204).json({ success: true, data: null });
});
