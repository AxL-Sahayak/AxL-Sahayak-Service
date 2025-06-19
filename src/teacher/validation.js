import Joi from 'joi';

const name = Joi.string().trim().required().empty().messages({
    'any.required': 'Teacher Name field is required',
    'string.base': ' Teacher Name field must be a string',
    'string.empty': 'Teacher Name field is must be a non-empty',
});

const userName = Joi.string().email().trim().required().empty().messages({
    'any.required': 'UserName field is required',
    'string.base': 'UserName field must be a string',
    'string.email': 'UserName field must be a valid email address',
    'string.empty': 'UserName field must be a non-empty',
});

const password = Joi.string().trim().required().empty().messages({
    'any.required': 'Password field is required',
    'string.base': 'Password field must be a string',
    'string.empty': 'Password field must be a non-empty',
});

const PEN = Joi.string()
    .trim()
    .pattern(/^\d{9}$/)
    .message('Invalid PEN format')
    .required()
    .empty()
    .messages({
        'any.required': 'PEN field is required',
        'string.base': 'PEN field must be a string',
        'string.empty': 'PEN field must be a non-empty',
    });

const studentName = Joi.string().trim().required().empty().messages({
    'any.required': 'Student Name field is required',
    'string.base': ' Student Name field must be a string',
    'string.empty': 'Student Name field is must be a non-empty',
});

const className = Joi.number().integer().min(1).max(12).required().messages({
    'any.required': 'Class field is required',
    'number.base': 'Class field must be a number',
    'number.min': 'Class field must be at least 1',
    'number.max': 'Class field must be at most 12',
});
const section = Joi.string().valid('A', 'B', 'C', 'D', 'E', 'F').required().messages({
    'any.required': 'Section field is required',
    'string.base': 'Section field must be a string',
    'any.only': 'Section must be one of A, B, C, D, E or F',
    'string.empty': 'Section field must be a non-empty string',
});

const languageArray = Joi.array()
    .items(
        Joi.string().trim().required().messages({
            'string.base': 'Language must be a string',
            'string.empty': 'Language cannot be empty',
        })
    )
    .min(1)
    .required()
    .messages({
        'any.required': 'Languages field is required',
        'array.base': 'Languages must be an array',
        'array.min': 'At least one language must be selected',
    });

const languageName = Joi.string().trim().empty().required().messages({
    'any.required': 'Language field is required',
    'string.base': ' Language field must be a string',
    'string.empty': 'Language field is must be a non-empty',
});

const registerValidationSchema = Joi.object({
    name: name,
    userName: userName,
    password: password,
});

const loginValidationSchema = Joi.object({
    userName: userName,
    password: password,
});

const addLanguageValidationSchema = Joi.object({
    languageName: languageName,
});

const addStudentValidationSchema = Joi.object({
    studentName: studentName,
    PEN: PEN,
    className: className,
    section: section,
    language: languageArray,
});

const mapStudentLanguageSchema = Joi.object({
    PEN,
    language: languageArray,
});

export {
    registerValidationSchema,
    loginValidationSchema,
    addStudentValidationSchema,
    addLanguageValidationSchema,
    mapStudentLanguageSchema,
};
