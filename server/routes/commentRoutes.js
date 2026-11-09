// Mounted at /api/photos/:id/comments (mergeParams exposes :id to the controller).
const router = require('express').Router({ mergeParams: true });
const comments = require('../controllers/commentController');
const requireUser = require('../middleware/requireUser');
const { validate, commentSchema } = require('../middleware/validation');

router.post('/', requireUser, validate(commentSchema), comments.create);
module.exports = router;
