const Comment = require('../models/Comment');
const Article = require('../models/Article');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

// POST /api/comments
exports.createComment = asyncHandler(async (req, res, next) => {
  const { articleId, name, email, content, parentId } = req.body;

  const article = await Article.findById(articleId);
  if (!article || article.status !== 'published') {
    return next(new AppError('Article not found', 404));
  }

  const comment = await Comment.create({
    article: articleId,
    author: { name, email },
    content,
    parent: parentId || null,
    ipAddress: req.ip,
  });

  // If reply, add to parent's replies array
  if (parentId) {
    await Comment.findByIdAndUpdate(parentId, { $push: { replies: comment._id } });
  }

  res.status(201).json({
    success: true,
    data: comment,
    message: 'Comment submitted and awaiting moderation.',
  });
});

// GET /api/comments/article/:articleId — approved comments with nested replies
exports.getCommentsByArticle = asyncHandler(async (req, res) => {
  const comments = await Comment.find({
    article: req.params.articleId,
    status: 'approved',
    parent: null,
  })
    .populate({
      path: 'replies',
      match: { status: 'approved' },
      options: { sort: { createdAt: 1 } },
    })
    .sort({ pinned: -1, createdAt: -1 })
    .lean();

  res.status(200).json({ success: true, data: comments });
});

// GET /api/comments — admin: all comments with filters
exports.getAllComments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status, sort = '-createdAt' } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [comments, total] = await Promise.all([
    Comment.find(filter)
      .populate('article', 'title slug')
      .sort(sort).skip(skip).limit(Number(limit)).lean(),
    Comment.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: comments,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
  });
});

// PATCH /api/comments/:id/approve
exports.approveComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
  if (!comment) return next(new AppError('Comment not found', 404));
  res.status(200).json({ success: true, data: comment });
});

// PATCH /api/comments/:id/reject
exports.rejectComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
  if (!comment) return next(new AppError('Comment not found', 404));
  res.status(200).json({ success: true, data: comment });
});

// PATCH /api/comments/:id/spam
exports.markSpam = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, { status: 'spam' }, { new: true });
  if (!comment) return next(new AppError('Comment not found', 404));
  res.status(200).json({ success: true, data: comment });
});

// PATCH /api/comments/:id/pin
exports.pinComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return next(new AppError('Comment not found', 404));
  comment.pinned = !comment.pinned;
  await comment.save();
  res.status(200).json({ success: true, data: comment });
});

// DELETE /api/comments/:id
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return next(new AppError('Comment not found', 404));
  await comment.deleteOne();
  res.status(204).json({ success: true, data: null });
});
