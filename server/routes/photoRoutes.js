const router = require('express').Router();
const photos = require('../controllers/photoController');
const requireUser = require('../middleware/requireUser');
const upload = require('../middleware/upload');

router.get('/', photos.getAll);
router.get('/:id', photos.getOne);
router.post('/', requireUser, upload.single('photoFile'), photos.create);
router.put('/:id/like', requireUser, photos.toggleLike); // PUT is used to update the likes array
router.delete('/:id', requireUser, photos.remove);
module.exports = router;
