const router = require('express').Router();
const ctrl = require('../controllers/authController');
const { validate, registerSchema, loginSchema } = require('../middleware/validation');
router.post('/register', validate(registerSchema), ctrl.register);
router.post('/login', validate(loginSchema), ctrl.login);
module.exports = router;
