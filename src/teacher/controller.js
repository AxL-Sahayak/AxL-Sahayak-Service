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
    mapStudentLanguageSchema,
} from './validation.js';
import { JWT_ENCRYPTION_PRIVATE_KEY, JWT_SIGNIN_PRIVATE_KEY } from '../config.js';
import {
    validationResponse,
    successResponse,
    errorResponse,
} from '../utils/handleServerResponse.js';
import * as teacherService from './services/teacherService.js';
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
            const data = languages.map((lang) => ({
                id: lang._id.toString(),
                title: lang.languageName,
            }));
            const responseData = successResponse('Languages fetched successfully', data);
            return res.status(200).json(responseData);
        } else {
            const responseData = errorResponse(404, 'No languages found');
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
    const teacherId = res.locals.decodedToken.payload._id;

    try {
        const { penId, section, language } = req.body;

        if (!penId || !section || !language) {
            const responseData = errorResponse(400, 'Required fields are missing');
            return res.status(200).json(responseData);
        }

        const students = await fs.readJson(StudentFilePath);
        const matchedStudent = students.find((s) => s.PEN === penId);

        if (!matchedStudent) {
            return res.status(200).json(errorResponse(400, 'Student not found in PEN list'));
        }

        const existingMap = await teacherService.getTeachMapByStudentAndTeacher(teacherId, penId);
        if (existingMap) {
            return res.status(200).json(errorResponse(400, 'Student already added'));
        }

        const studentPayload = {
            studentName: matchedStudent.name,
            PEN: matchedStudent.PEN,
            className: matchedStudent.class,
            section,
        };
        const { error } = addStudentValidationSchema.validate({
            ...studentPayload,
            language: language,
        });
        if (error) {
            return res.status(200).json(validationResponse(error.message));
        }

        const { error: langError } = mapStudentLanguageSchema.validate({ PEN: penId, language });
        if (langError) {
            return res.status(200).json(validationResponse(langError.message));
        }

        let existingDbStudent = await teacherService.getStudentByPEN(penId);
        if (!existingDbStudent) {
            existingDbStudent = await teacherService.addStudent({
                ...studentPayload,
                createdBy: teacherId,
            });
        }

        await teacherService.addTeachMap(teacherId, existingDbStudent.PEN, language);
        const myStudents = await teacherService.getMappedStudentPENsByTeacher(teacherId);

        return res.status(200).json(
            successResponse('Student added successfully', {
                student: existingDbStudent,
                myStudents: myStudents,
            })
        );
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

const getMyCohorts = async (req, res) => {
    const teacherId = res.locals.decodedToken.payload._id;

    try {
        const mappings = await teacherService.getTeachMapsByTeacher(teacherId);

        if (!mappings.length) {
            return res.status(200).json(successResponse('No cohorts found', []));
        }

        const cohortMap = new Map();

        for (const { penId, languages } of mappings) {
            const student = await teacherService.getStudentByPEN(penId);
            if (!student) continue;

            languages.forEach((lang) => {
                const cohortId = `${student.className}_${student.section}_${lang}`;
                if (!cohortMap.has(cohortId)) {
                    cohortMap.set(cohortId, {
                        cohortId,
                        cohortDetails: {
                            class: student.className,
                            section: student.section,
                            language: lang,
                        },
                    });
                }
            });
        }

        return res
            .status(200)
            .json(successResponse('Cohorts fetched successfully', Array.from(cohortMap.values())));
    } catch (err) {
        globalErrorHandler(res, err);
    }
};

const getStudentsByCohort = async (req, res) => {
    const teacherId = res.locals.decodedToken.payload._id;
    const { cohortId } = req.query;
    if (!cohortId) {
        return res.status(200).json(errorResponse(400, 'cohortId is required'));
    }

    const [className, section, language] = cohortId.split('_');
    try {
        const students = await teacherService.getStudentsByCohort(
            teacherId,
            className,
            section,
            language
        );
        return res.status(200).json(successResponse('Students fetched successfully', students));
    } catch (err) {
        globalErrorHandler(res, err);
    }
};

export {
    register,
    login,
    getStudentByPEN,
    addSingleStudent,
    addLanguage,
    getAllLanguage,
    getMyCohorts,
    getStudentsByCohort,
};
