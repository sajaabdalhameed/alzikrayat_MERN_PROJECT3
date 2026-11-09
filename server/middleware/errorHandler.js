const fs = require('fs');
module.exports = (err, req, res, next) => {
  if (req.file) fs.unlink(req.file.path, () => {});
  if (err.name === 'MulterError' || err.isUploadError) return res.status(400).json({ message: err.message });
  if (err.name === 'ValidationError') return res.status(422).json({ message: err.message });
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
};
