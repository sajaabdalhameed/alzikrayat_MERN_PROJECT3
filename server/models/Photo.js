const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fileName: { type: String, required: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, default: '' },
  dateTime: { type: Date, default: Date.now }, // ضفنا الفاصلة هنا
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array of user IDs who liked the photo
});

module.exports = mongoose.model('Photo', photoSchema); 
