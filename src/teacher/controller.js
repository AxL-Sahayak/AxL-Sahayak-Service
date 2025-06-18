import * as jose from 'jose';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import passwordEncrypt from '../utils/handlePasswordEncrypt.js';
import {
    registerValidationSchema,
    loginValidationSchema,
    addStudentValidationSchema,
    addLanguageValidationSchema,
} from './validation.js';
import { JWT_ENCRYPTION_PRIVATE_KEY, JWT_SIGNIN_PRIVATE_KEY } from '../config.js';
import {
    validationResponse,
    successResponse,
    errorResponse,
} from '../utils/handleServerResponse.js';
import * as teacherService from './service.js';
import globalErrorHandler from '../utils/globalErrorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const StudentFilePath = path.join(__dirname, '../data/students.json');

const register = async (req, res) => {
    try {
        const { name, userName, password } = req.body;

        const { error } = registerValidationSchema.validate(req.body);
        if (error) {
            const responseData = validationResponse(error.message);
            return res.status(200).json(responseData);
        }
        const existingUser = await teacherService.getUserByEmail(userName);
        if (existingUser) {
            const responseData = errorResponse(401, 'User already exists');
            return res.status(200).json(responseData);
        } else {
            const hashedPassword = await passwordEncrypt(password);
            const newUser = await teacherService.createNewUser({
                name,
                userName,
                password: hashedPassword,
            });
            if (newUser) {
                const responseData = successResponse('User created successfully', newUser);
                return res.status(200).json(responseData);
            }
        }
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const { error } = loginValidationSchema.validate(req.body);
        if (error) {
            const responseData = validationResponse(error.message);
            return res.status(200).json(responseData);
        }
        const user = await teacherService.getUserByEmail(userName);
        if (!user) {
            const responseData = errorResponse(404, 'Account does not exists');
            return res.status(200).json(responseData);
        } else {
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) {
                const responseData = errorResponse(401, 'Incorrect email or password');
                return res.status(200).json(responseData);
            }
            const jwtSigninKey = new TextEncoder().encode(JWT_SIGNIN_PRIVATE_KEY);
            const jwtSignedToken = await new jose.SignJWT({
                _id: user._id.toString(),
                userName: user.userName,
                isAdmin: user.isAdmin,
            })
                .setProtectedHeader({ alg: 'HS256' })
                .setExpirationTime('48h')
                .sign(jwtSigninKey);

            const jwtEncryptionKey = jose.base64url.decode(JWT_ENCRYPTION_PRIVATE_KEY);
            const jwtEncryptedToken = await new jose.EncryptJWT({ jwtSignedToken })
                .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
                .setExpirationTime('48h')
                .encrypt(jwtEncryptionKey);

            const data = {
                name: user.name,
                userName: user.userName,
                isAdmin: user.isAdmin,
                token: jwtEncryptedToken,
            };
            const responseData = successResponse('Login successful', data);
            return res.status(200).json(responseData);
        }
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

const getStudentByPEN = async (req, res) => {
    try {
        const { pen } = req.query;

        if (!pen) {
            const responseData = errorResponse(400, 'PEN is required');
            return res.status(200).json(responseData);
        }

        const students = await fs.readJson(StudentFilePath);
        const student = students.find((s) => s.PEN === pen);

        // Check if student exists

        if (student) {
            const responseData = successResponse('Student fetched successfully', student);
            return res.status(200).json(responseData);
        } else {
            const responseData = errorResponse(404, 'Student not found');
            return res.status(200).json(responseData);
        }
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

const addSingleStudent = async (req, res) => {
    const userId = res.locals.decodedToken.payload._id;

    try {
        const { penId, section, language } = req.body;
        if (!penId || !section || !language) {
            const responseData = errorResponse(400, 'Required fields are missing');
            return res.status(200).json(responseData);
        }

        const students = await fs.readJson(StudentFilePath);

        const existingStudent = students.find((s) => s.PEN === penId);
        if (!existingStudent) {
            const responseData = errorResponse(400, 'Student not exists');
            return res.status(200).json(responseData);
        }

        const existingDbStudent = await teacherService.getStudentByPEN(penId);
        if (existingDbStudent) {
            const responseData = errorResponse(400, 'Student already exists in the database');
            return res.status(200).json(responseData);
        }

        const data = {
            studentName: existingStudent.name,
            PEN: existingStudent.PEN,
            className: existingStudent.class,
            section: section,
            language: language,
        };
        const { error } = addStudentValidationSchema.validate(data);
        if (error) {
            const responseData = validationResponse(error.message);
            return res.status(200).json(responseData);
        }

        const newStudent = await teacherService.addStudent({
            ...data,
            createdBy: userId,
        });
        const responseData = successResponse('Student added successfully', newStudent);

        return res.status(200).json(responseData);
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

const addLanguage = async (req, res) => {
    try {
        const { languageName } = req.body;
        const { error } = addLanguageValidationSchema.validate(req.body);
        if (error) {
            const responseData = validationResponse(error.message);
            return res.status(200).json(responseData);
        }
        const existingLanguage = await teacherService.getLanguage(languageName.toLowerCase());
        if (existingLanguage) {
            const responseData = errorResponse(400, 'Language already exists');
            return res.status(200).json(responseData);
        } else {
            const newLanguage = await teacherService.addLanguage({
                languageName: languageName.toLowerCase(),
            });
            if (newLanguage) {
                const responseData = successResponse('Language added successfully', newLanguage);
                return res.status(200).json(responseData);
            }
        }
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

const getAllLanguage = async (req, res) => {
    try {
        const languages = await teacherService.getAllLanguages();
        if (languages.length > 0) {
            const responseData = successResponse('Languages fetched successfully', languages);
            return res.status(200).json(responseData);
        } else {
            const responseData = errorResponse(404, 'No languages found');
            return res.status(200).json(responseData);
        }
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

export { register, login, getStudentByPEN, addSingleStudent, addLanguage, getAllLanguage };
