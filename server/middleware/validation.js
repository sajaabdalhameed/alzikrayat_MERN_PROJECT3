const Joi = require('joi');

const registerSchema = Joi.object({
  firstName: Joi.string().pattern(/^[\p{L}\p{M}]+$/u).max(50).required(),
  lastName: Joi.string().pattern(/^[\p{L}\p{M}]+$/u).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
const photoSchema = Joi.object({
  title: Joi.string().trim().max(200).required(),
  description: Joi.string().allow('').optional()
});
const commentSchema = Joi.object({ comment: Joi.string().trim().required() });

// Returns an Express middleware that validates req.body against a Joi schema.
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: true });
  if (error) return res.status(422).json({ message: error.details[0].message });
  req.body = value;
  next();
};

module.exports = { validate, registerSchema, loginSchema, photoSchema, commentSchema };
