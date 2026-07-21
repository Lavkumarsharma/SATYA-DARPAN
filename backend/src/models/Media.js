const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    originalName: String,
    gridfsId: { type: mongoose.Schema.Types.ObjectId, required: true }, // GridFS file ID
    url: { type: String, required: true },                              // Served via /api/media/file/:id
    resourceType: { type: String, enum: ['image', 'video', 'raw'], default: 'image' },
    mimetype: { type: String },
    format: String,
    size: Number,
    width: Number,
    height: Number,
    duration: Number,
    folder: { type: String, default: 'general' },
    tags: [String],
    alt: String,
    caption: String,
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    usageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

mediaSchema.index({ folder: 1 });
mediaSchema.index({ resourceType: 1 });
mediaSchema.index({ tags: 1 });
mediaSchema.index({ name: 'text', originalName: 'text' });

module.exports = mongoose.model('Media', mediaSchema);
