const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
    author: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true },
      avatar: String,
    },
    content: { type: String, required: true, maxlength: [2000, 'Comment too long'] },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'spam'],
      default: 'pending',
    },
    pinned: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    reports: [
      {
        reason: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    ipAddress: { type: String, select: false },
  },
  { timestamps: true }
);

commentSchema.index({ article: 1, status: 1 });
commentSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);
