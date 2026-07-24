const Article = require('../models/Article');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/search?q=...&category=...&tags=...&year=...&sort=...&page=...
exports.search = asyncHandler(async (req, res) => {
  const {
    q, category, tags, year, author,
    sort = 'newest', page = 1, limit = 20,
  } = req.query;

  const filter = { status: 'published' };

  if (q && q.trim()) {
    const rawQuery = q.trim();
    const queryLower = rawQuery.toLowerCase();
    
    // Transliteration dictionary map for Hindi <-> English terms
    const TRANSLITERATIONS = [
      { en: ['jantar mantar', 'protest', 'lathi charge', 'dharmendra pradhan', 'neet'], hi: ['जंतर मंतर', 'प्रदर्शन', 'लाठीचार्ज', 'धर्मेंद्र प्रधान', 'नीट'] },
      { en: ['pm cares', 'pm cares fund', 'cag', 'rti', 'ventilator'], hi: ['पीएम केयर्स', 'पीएम केयर', 'सीएजी', 'आरटीआई', 'वेंटिलेटर'] },
      { en: ['electoral bonds', 'bond', 'bjp', 'supreme court'], hi: ['इलेक्टोरल बॉन्ड्स', 'चुनावी बॉन्ड', 'सुप्रीम कोर्ट'] },
      { en: ['adani', 'hindenburg', 'lic', 'sbi'], hi: ['अडानी', 'हिंडनबर्ग', 'एलआईसी', 'एसबीआई'] },
      { en: ['economy', 'gdp', 'unemployment'], hi: ['अर्थव्यवस्था', 'जीडीपी', 'बेरोजगारी'] },
    ];

    const matchingTerms = new Set([rawQuery]);

    for (const group of TRANSLITERATIONS) {
      const matchEn = group.en.some(t => queryLower.includes(t) || t.includes(queryLower));
      const matchHi = group.hi.some(t => rawQuery.includes(t) || t.includes(rawQuery));
      if (matchEn || matchHi) {
        group.en.forEach(t => matchingTerms.add(t));
        group.hi.forEach(t => matchingTerms.add(t));
      }
    }

    const orConditions = [];
    matchingTerms.forEach(term => {
      const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      orConditions.push({ title: regex });
      orConditions.push({ excerpt: regex });
    });

    filter.$or = orConditions;
  }
  if (category) filter.category = category;
  if (tags) filter.tags = { $in: tags.split(',') };
  if (author) filter.author = author;
  if (year) {
    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${Number(year) + 1}-01-01`);
    filter.publishedAt = { $gte: startOfYear, $lt: endOfYear };
  }

  let sortOption = 'order -publishedAt -createdAt';
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
