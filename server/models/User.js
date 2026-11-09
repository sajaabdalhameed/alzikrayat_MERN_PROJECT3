const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, maxlength: 50 },
  lastName: { type: String, required: true, trim: true, maxlength: 50 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'] },
  password: { type: String, required: true }, // bcrypt hash only
  location: { type: String },
  description: { type: String },
  occupation: { type: String }
});
module.exports = mongoose.model('User', userSchema);
