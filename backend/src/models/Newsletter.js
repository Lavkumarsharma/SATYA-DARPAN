const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  name: String,
  status: { type: String, enum: ['active', 'unsubscribed'], default: 'active' },
  subscribedAt: { type: Date, default: Date.now },
  unsubscribedAt: Date,
});

module.exports = mongoose.model('Newsletter', newsletterSchema);
