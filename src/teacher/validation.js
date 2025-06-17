import Joi from 'joi';

const name = Joi.string().trim().required().empty().messages({
    'any.required': 'Teacher Name field is required',
    'string.base': ' Teacher Name field must be a string',
    'string.empty': 'Teacher Name field is must be a non-empty',
});

const email = Joi.string().email().trim().required().empty().messages({
    'any.required': 'Email field is required',
    'string.base': 'Email field must be a string',
    'string.email': 'Email field must be a valid email address',
    'string.empty': 'Email field must be a non-empty',
});

const password = Joi.string().trim().required().empty().messages({
    'any.required': 'Password field is required',
    'string.base': 'Password field must be a string',
    'string.empty': 'Password field must be a non-empty',
});

const registerValidationSchema = Joi.object({
    name: name,
    email: email,
    password: password,
});

const loginValidationSchema = Joi.object({
    email: email,
    password: password,
});

export { registerValidationSchema, loginValidationSchema };
