const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  year: { type: Number },
  summary: { type: String },
  isAvailable: { type: Boolean, default: true },
  isbn: { type: String },
  category: { type: String },
  reservedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
