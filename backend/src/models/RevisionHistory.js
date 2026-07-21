const mongoose = require('mongoose');

const revisionSchema = new mongoose.Schema({
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  content: { type: mongoose.Schema.Types.Mixed },
  title: String,
  savedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  version: { type: Number, default: 1 },
  note: String,
  createdAt: { type: Date, default: Date.now },
});

revisionSchema.index({ article: 1, createdAt: -1 });

module.exports = mongoose.model('RevisionHistory', revisionSchema);
