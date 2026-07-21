const mongoose = require('mongoose');
const slugify = require('slugify');

// Helper: extract plain text from Tiptap JSON to estimate reading time
const extractTextFromTiptap = (node) => {
  if (!node) return '';
  if (node.type === 'text') return node.text || '';
  if (node.content && Array.isArray(node.content)) {
    return node.content.map(extractTextFromTiptap).join(' ');
  }
  return '';
};

const referenceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: String,
  type: {
    type: String,
    enum: ['official', 'news', 'research', 'book', 'court', 'government', 'other'],
    default: 'other',
  },
  description: String,
});

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed, // Tiptap JSON document
      default: { type: 'doc', content: [] },
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    coverImage: {
      url: String,
      publicId: String,
      alt: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author is required'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    featured: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    editorsPick: { type: Boolean, default: false },
    factCheck: { type: Boolean, default: false },
    readingTime: { type: Number, default: 1 },
    views: { type: Number, default: 0 },
    seo: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String,
      keywords: [String],
      canonicalUrl: String,
      schema: mongoose.Schema.Types.Mixed,
    },
    references: [referenceSchema],
    publishedAt: Date,
    scheduledAt: Date,
  },
  { timestamps: true }
);

// Auto-generate slug from title
articleSchema.pre('save', async function (next) {
  if (!this.slug && this.title) {
    let baseSlug = slugify(this.title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const existing = await mongoose.model('Article').findOne({ slug, _id: { $ne: this._id } });
      if (!existing) break;
      slug = `${baseSlug}-${counter++}`;
    }

    this.slug = slug;
  }

  // Auto-calculate reading time from content
  if (this.isModified('content') && this.content) {
    const text = extractTextFromTiptap(this.content);
    const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    this.readingTime = Math.max(1, Math.ceil(wordCount / 200));
  }

  next();
});

// Text search index
articleSchema.index({ title: 'text', excerpt: 'text' });
articleSchema.index({ slug: 1 });
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1, status: 1 });
articleSchema.index({ tags: 1, status: 1 });
articleSchema.index({ featured: 1, status: 1 });
articleSchema.index({ views: -1, status: 1 });

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
