const multer = require('multer');
const path = require('path');
const allowed = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/gif': '.gif' };
module.exports = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', 'uploads'),
    filename: (req, file, cb) =>
      cb(null, `photo_${Date.now()}_${Math.round(Math.random() * 1e9)}${allowed[file.mimetype]}`)
  }),
  fileFilter: (req, file, cb) => {
    if (allowed[file.mimetype]) return cb(null, true);
    const e = new Error('Only JPG, PNG and GIF images are allowed.'); e.isUploadError = true; cb(e);
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});
