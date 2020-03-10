const Joi = require('@hapi/joi');

const loginSchema = Joi.object({
	email: Joi.string().min(6).required().email(),
	password: Joi.string().min(6).required()
});

const Validation = (schema) => (data) => schema.validate(data);

module.exports.loginValidation = Validation(loginSchema);
