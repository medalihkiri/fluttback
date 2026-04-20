const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firstname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar_url: { type: String, default: '' },
  reset_code: { type: String },
  reset_code_expires: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
