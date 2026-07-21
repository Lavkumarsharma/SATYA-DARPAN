const Category = require('../models/Category');
const Article = require('../models/Article');
const { AppError, asyncHandler } = require('../middleware/errorHandler');

exports.getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort('name').lean();
  const categoriesWithCounts = await Promise.all(
    categories.map(async (cat) => {
      const count = await Article.countDocuments({ category: cat._id, status: 'published' });
      return { ...cat, articleCount: count };
    })
  );
  res.status(200).json({ success: true, data: categoriesWithCounts });
});

exports.getCategoryBySlug = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug }).lean();
  if (!category) return next(new AppError('Category not found', 404));
  res.status(200).json({ success: true, data: category });
});

exports.getCategoryArticles = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug }).lean();
  if (!category) return next(new AppError('Category not found', 404));

  const { page = 1, limit = 12, sort = '-publishedAt' } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const [articles, total] = await Promise.all([
    Article.find({ category: category._id, status: 'published' })
      .populate('author', 'name avatar').populate('tags', 'name slug color')
      .sort(sort).skip(skip).limit(Number(limit)).lean(),
    Article.countDocuments({ category: category._id, status: 'published' }),
  ]);

  res.status(200).json({
    success: true,
    data: articles,
    category,
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) },
  });
});

exports.createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

exports.updateCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) return next(new AppError('Category not found', 404));
  res.status(200).json({ success: true, data: category });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new AppError('Category not found', 404));
  await category.deleteOne();
  res.status(204).json({ success: true, data: null });
});
