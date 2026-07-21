const mongoose = require('mongoose');
const slugify = require('slugify');

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Category name is required'], unique: true, trim: true },
    slug: { type: String, unique: true, lowercase: true },
    description: String,
    icon: { type: String, default: 'Folder' },
    color: { type: String, default: '#6366f1' },
    image: { url: String, publicId: String },
    seo: { metaTitle: String, metaDescription: String },
    articleCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

categorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Category', categorySchema);
