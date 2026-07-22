const mongoose = require('mongoose');
const Article = require('../models/Article');
const RevisionHistory = require('../models/RevisionHistory');
const AuditLog = require('../models/AuditLog');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

const POPULATE_ARTICLE = [
  { path: 'author', select: 'name email avatar bio' },
  { path: 'category', select: 'name slug color icon' },
  { path: 'tags', select: 'name slug color' },
];

// GET /api/articles — public paginated list (only published)
exports.getPublishedArticles = asyncHandler(async (req, res) => {
  const {
    page = 1, limit = 12, category, tags, sort = 'order -publishedAt',
    featured, factCheck, search,
  } = req.query;

  const filter = { status: 'published' };
  if (category) {
    if (mongoose.Types.ObjectId.isValid(category)) {
      filter.category = category;
    } else {
      const Category = require('../models/Category');
      const foundCategory = await Category.findOne({ slug: category });
      if (foundCategory) {
        filter.category = foundCategory._id;
      } else {
        filter.category = new mongoose.Types.ObjectId();
      }
    }
  }
  if (tags) filter.tags = { $in: tags.split(',') };
  if (featured === 'true') filter.featured = true;
  if (factCheck === 'true') filter.factCheck = true;
  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [articles, total] = await Promise.all([
    Article.find(filter).populate(POPULATE_ARTICLE).sort(sort).skip(skip).limit(Number(limit)).lean(),
    Article.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: articles,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      pages: Math.ceil(total / Number(limit)),
      hasNext: skip + articles.length < total,
      hasPrev: Number(page) > 1,
    },
  });
});

// GET /api/articles/admin — admin list (all statuses)
exports.getAllArticles = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, status, category, author, sort = 'order -createdAt', search } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (author) filter.author = author;
  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [articles, total] = await Promise.all([
    Article.find(filter).populate(POPULATE_ARTICLE).sort(sort).skip(skip).limit(Number(limit)).lean(),
    Article.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: articles,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)), hasNext: skip + articles.length < total, hasPrev: Number(page) > 1 },
  });
});

// GET /api/articles/featured
exports.getFeaturedArticles = asyncHandler(async (req, res) => {
  const articles = await Article.find({ status: 'published', featured: true })
    .populate(POPULATE_ARTICLE).sort('-publishedAt').limit(5).lean();
  res.status(200).json({ success: true, data: articles });
});

// GET /api/articles/trending
exports.getTrendingArticles = asyncHandler(async (req, res) => {
  const articles = await Article.find({ status: 'published' })
    .populate(POPULATE_ARTICLE).sort('-views').limit(10).lean();
  res.status(200).json({ success: true, data: articles });
});

// GET /api/articles/editors-picks
exports.getEditorsPicks = asyncHandler(async (req, res) => {
  const articles = await Article.find({ status: 'published', editorsPick: true })
    .populate(POPULATE_ARTICLE).sort('-publishedAt').limit(6).lean();
  res.status(200).json({ success: true, data: articles });
});

// GET /api/articles/fact-checks
exports.getFactChecks = asyncHandler(async (req, res) => {
  const articles = await Article.find({ status: 'published', factCheck: true })
    .populate(POPULATE_ARTICLE).sort('-publishedAt').limit(12).lean();
  res.status(200).json({ success: true, data: articles });
});

// GET /api/articles/:slug  or  /api/articles/slug/:slug
exports.getArticleBySlug = asyncHandler(async (req, res, next) => {
  // Supports both /articles/:slug and /articles/slug/:slug
  const slug = req.params.slug;
  const article = await Article.findOne({ slug, status: 'published' })
    .populate(POPULATE_ARTICLE).lean();

  if (!article) return next(new AppError('Article not found', 404));

  // Increment views (non-blocking)
  Article.findByIdAndUpdate(article._id, { $inc: { views: 1 } }).exec();

  res.status(200).json({ success: true, data: article });
});

// GET /api/articles/:id/admin — admin can see drafts
exports.getArticleById = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id).populate(POPULATE_ARTICLE);
  if (!article) return next(new AppError('Article not found', 404));
  res.status(200).json({ success: true, data: article });
});

// POST /api/articles
exports.createArticle = asyncHandler(async (req, res) => {
  const article = await Article.create({ ...req.body, author: req.user._id });

  await AuditLog.create({
    action: 'article.create', actor: req.user._id, actorEmail: req.user.email,
    entity: 'Article', entityId: article._id, ipAddress: req.ip,
  });

  res.status(201).json({ success: true, data: article });
});

// PUT /api/articles/:id
exports.updateArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  if (!article) return next(new AppError('Article not found', 404));

  // Save revision before update
  const revisionCount = await RevisionHistory.countDocuments({ article: article._id });
  await RevisionHistory.create({
    article: article._id,
    content: article.content,
    title: article.title,
    savedBy: req.user._id,
    version: revisionCount + 1,
  });

  const updated = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .populate(POPULATE_ARTICLE);

  await AuditLog.create({
    action: 'article.update', actor: req.user._id, actorEmail: req.user.email,
    entity: 'Article', entityId: article._id, ipAddress: req.ip,
  });

  res.status(200).json({ success: true, data: updated });
});

// PATCH /api/articles/:id/publish
exports.publishArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findByIdAndUpdate(
    req.params.id,
    { status: 'published', publishedAt: new Date() },
    { new: true }
  ).populate(POPULATE_ARTICLE);

  if (!article) return next(new AppError('Article not found', 404));

  await AuditLog.create({
    action: 'article.publish', actor: req.user._id, actorEmail: req.user.email,
    entity: 'Article', entityId: article._id, ipAddress: req.ip,
  });

  res.status(200).json({ success: true, data: article });
});

// PATCH /api/articles/:id/unpublish
exports.unpublishArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findByIdAndUpdate(
    req.params.id, { status: 'draft' }, { new: true }
  );
  if (!article) return next(new AppError('Article not found', 404));
  res.status(200).json({ success: true, data: article });
});

// DELETE /api/articles/:id
exports.deleteArticle = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id);
  if (!article) return next(new AppError('Article not found', 404));
  await article.deleteOne();

  await AuditLog.create({
    action: 'article.delete', actor: req.user._id, actorEmail: req.user.email,
    entity: 'Article', entityId: req.params.id, details: { title: article.title }, ipAddress: req.ip,
  });

  res.status(204).json({ success: true, data: null });
});

// GET /api/articles/:id/revisions
exports.getRevisions = asyncHandler(async (req, res) => {
  const revisions = await RevisionHistory.find({ article: req.params.id })
    .populate('savedBy', 'name avatar')
    .sort('-createdAt')
    .limit(20);
  res.status(200).json({ success: true, data: revisions });
});

// POST /api/articles/:id/restore/:revisionId
exports.restoreRevision = asyncHandler(async (req, res, next) => {
  const revision = await RevisionHistory.findById(req.params.revisionId);
  if (!revision) return next(new AppError('Revision not found', 404));

  const article = await Article.findByIdAndUpdate(
    req.params.id,
    { content: revision.content, title: revision.title },
    { new: true }
  );

  res.status(200).json({ success: true, data: article, message: 'Revision restored successfully' });
});

// GET /api/articles/:id/related
exports.getRelatedArticles = asyncHandler(async (req, res, next) => {
  const article = await Article.findById(req.params.id).lean();
  if (!article) return next(new AppError('Article not found', 404));

  const related = await Article.find({
    _id: { $ne: article._id },
    status: 'published',
    $or: [
      { category: article.category },
      { tags: { $in: article.tags } },
    ],
  }).populate(POPULATE_ARTICLE).limit(4).lean();

  res.status(200).json({ success: true, data: related });
});

// PUT /api/articles/reorder — admin bulk update article order sequence
exports.reorderArticles = asyncHandler(async (req, res, next) => {
  const { orders } = req.body;
  if (!Array.isArray(orders)) {
    return next(new AppError('Orders array is required', 400));
  }

  const bulkOps = orders.map((id, index) => ({
    updateOne: {
      filter: { _id: id },
      update: { order: index },
    },
  }));

  if (bulkOps.length > 0) {
    await Article.bulkWrite(bulkOps);
  }

  res.status(200).json({ success: true, message: 'Articles reordered and synced successfully' });
});
