const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: [true, 'Section key is required'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Section title is required'],
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, 'Section data is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Section', sectionSchema);
