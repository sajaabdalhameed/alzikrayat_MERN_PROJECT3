const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Photo = require('../models/Photo');
const Comment = require('../models/Comment');
const { photoSchema } = require('../middleware/validation');

const removeFile = (name) => fs.unlink(path.join(__dirname, '..', 'uploads', name), () => {});

exports.getAll = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 0;
    const photos = await Photo.find().sort({ dateTime: -1 }).limit(limit)
      .populate('userId', 'firstName lastName');
    res.json(photos);
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Photo not found' });
    const photo = await Photo.findById(req.params.id).populate('userId', 'firstName lastName');
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    const comments = await Comment.find({ photoId: photo._id }).sort({ dateTime: 1 })
      .populate('userId', 'firstName lastName');
    res.json({ photo, comments });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Please select a valid image file.' });
    const { error, value } = photoSchema.validate(req.body);
    if (error) { removeFile(req.file.filename); return res.status(422).json({ message: error.details[0].message }); }
    const photo = await Photo.create({
      userId: req.userId, fileName: req.file.filename, title: value.title, description: value.description
    });
    res.status(201).json(photo);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Photo not found' });
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });
    if (String(photo.userId) !== req.userId) {
      return res.status(403).json({ message: 'You can only delete your own photos.' });
    }
    removeFile(photo.fileName);
    await Comment.deleteMany({ photoId: photo._id }); // replaces SQL ON DELETE CASCADE
    await photo.deleteOne();
    res.json({ message: 'Photo deleted' });
  } catch (err) { next(err); }
};
// Toggle like/unlike for a photo
exports.toggleLike = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(404).json({ message: 'Photo not found' });
    
    const photo = await Photo.findById(req.params.id);
    if (!photo) return res.status(404).json({ message: 'Photo not found' });

    // Check if the user already liked the photo
    const isLiked = photo.likes.includes(req.userId);

    if (isLiked) {
      // If liked, remove the user's ID (Unlike)
      photo.likes.pull(req.userId);
    } else {
      // If not liked, add the user's ID (Like)
      photo.likes.push(req.userId);
    }

    await photo.save();
    
    // Return the updated likes array so the frontend can update its state
    res.json({ likes: photo.likes }); 
  } catch (err) { next(err); }
}; 
