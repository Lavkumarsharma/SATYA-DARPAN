const Article = require('../models/Article');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/search?q=...&category=...&tags=...&year=...&sort=...&page=...
exports.search = asyncHandler(async (req, res) => {
  const {
    q, category, tags, year, author,
    sort, page = 1, limit = 20,
  } = req.query;

  const filter = { status: 'published' };

  if (q && q.trim()) {
    const rawQuery = q.trim();
    const escapedQuery = rawQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const exactRegex = new RegExp(escapedQuery, 'i');
    
    // Also match individual words for partial keyword search
    const words = rawQuery.split(/\s+/).filter(w => w.length > 1);
    const wordConditions = words.map(w => {
      const reg = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      return { $or: [{ title: reg }, { excerpt: reg }, { slug: reg }] };
    });

    filter.$or = [
      { title: exactRegex },
      { excerpt: exactRegex },
      { slug: exactRegex },
      ...(wordConditions.length > 0 ? wordConditions.flatMap(c => c.$or) : [])
    ];
  }

  if (category) filter.category = category;
  if (tags) filter.tags = { $in: tags.split(',') };
  if (author) filter.author = author;
  if (year) {
    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${Number(year) + 1}-01-01`);
    filter.publishedAt = { $gte: startOfYear, $lt: endOfYear };
  }

  let sortOption = 'order -publishedAt';
  if (sort === 'oldest') sortOption = 'publishedAt';
  else if (sort === 'popular') sortOption = '-views';

  const skip = (Number(page) - 1) * Number(limit);

  const [articles, total] = await Promise.all([
    Article.find(filter)
      .populate('author', 'name avatar')
      .populate('category', 'name slug color icon')
      .populate('tags', 'name slug color')
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
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
    },
    query: { q, category, tags, year, sort },
  });
});
