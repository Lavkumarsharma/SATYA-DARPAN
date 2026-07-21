const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/errorHandler');
const Article = require('../models/Article');
const Category = require('../models/Category');

// GET /api/seo/sitemap-data — returns all slugs for sitemap generation
router.get('/sitemap-data', asyncHandler(async (req, res) => {
  const [articles, categories] = await Promise.all([
    Article.find({ status: 'published' }).select('slug updatedAt publishedAt').lean(),
    Category.find().select('slug updatedAt').lean(),
  ]);
  res.status(200).json({ success: true, data: { articles, categories } });
}));

// GET /api/seo/rss — RSS feed data
router.get('/rss', asyncHandler(async (req, res) => {
  const articles = await Article.find({ status: 'published' })
    .select('title slug excerpt coverImage author publishedAt')
    .populate('author', 'name')
    .populate('category', 'name')
    .sort('-publishedAt')
    .limit(20)
    .lean();

  res.status(200).json({ success: true, data: articles });
}));

module.exports = router;
