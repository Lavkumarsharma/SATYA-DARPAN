const Article = require('../models/Article');
const Comment = require('../models/Comment');
const Newsletter = require('../models/Newsletter');
const Media = require('../models/Media');
const AuditLog = require('../models/AuditLog');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/analytics/dashboard
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalArticles, publishedArticles, draftArticles,
    totalComments, pendingComments, totalSubscribers, mediaCount,
    recentAuditLogs,
  ] = await Promise.all([
    Article.countDocuments(),
    Article.countDocuments({ status: 'published' }),
    Article.countDocuments({ status: 'draft' }),
    Comment.countDocuments(),
    Comment.countDocuments({ status: 'pending' }),
    Newsletter.countDocuments({ status: 'active' }),
    Media.countDocuments(),
    AuditLog.find().sort('-createdAt').limit(10).lean(),
  ]);

  // Total views
  const viewsResult = await Article.aggregate([
    { $group: { _id: null, totalViews: { $sum: '$views' } } },
  ]);
  const totalViews = viewsResult[0]?.totalViews || 0;

  res.status(200).json({
    success: true,
    data: {
      totalArticles,
      publishedArticles,
      draftArticles,
      totalViews,
      totalComments,
      pendingComments,
      totalSubscribers,
      mediaCount,
      recentAuditLogs,
    },
  });
});

// GET /api/analytics/views-trend?days=30
exports.getViewsTrend = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 30;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  // Group articles by publishedAt day and sum views
  const trend = await Article.aggregate([
    { $match: { status: 'published', publishedAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$publishedAt' } },
        views: { $sum: '$views' },
        articles: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', views: 1, articles: 1, _id: 0 } },
  ]);

  res.status(200).json({ success: true, data: trend });
});

// GET /api/analytics/top-articles
exports.getTopArticles = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 10;
  const articles = await Article.find({ status: 'published' })
    .select('title slug views coverImage publishedAt')
    .sort('-views')
    .limit(limit)
    .lean();

  res.status(200).json({ success: true, data: articles });
});

// POST /api/analytics/track — track a page view
exports.trackView = asyncHandler(async (req, res) => {
  const { articleId } = req.body;
  if (articleId) {
    await Article.findByIdAndUpdate(articleId, { $inc: { views: 1 } });
  }
  res.status(200).json({ success: true });
});
