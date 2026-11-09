const mongoose = require('mongoose');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');

exports.create = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id) || !(await Photo.exists({ _id: req.params.id }))) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    const created = await Comment.create({ photoId: req.params.id, userId: req.userId, comment: req.body.comment });
    const comment = await created.populate('userId', 'firstName lastName');
    
    // NEW: إرسال الكومنت الجديد فوراً لكل المتصلين
    const io = req.app.get('io');
    io.emit('newComment', comment); 

    res.status(201).json(comment);
  } catch (err) { next(err); }
};