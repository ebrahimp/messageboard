const Joi = require('@hapi/joi');

const postSchema = Joi.object({
	title: Joi.string().min(2).max(255).required(),
	body: Joi.string().min(2).max(2500).required()
});

const Validation = (schema) => (data) => schema.validate(data);

module.exports.postValidation = Validation(postSchema);
