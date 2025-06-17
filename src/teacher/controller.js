import * as jose from 'jose';
import bcrypt from 'bcryptjs';
import passwordEncrypt from '../utils/handlePasswordEncrypt.js';
import { registerValidationSchema, loginValidationSchema } from './validation.js';
import { JWT_ENCRYPTION_PRIVATE_KEY, JWT_SIGNIN_PRIVATE_KEY } from '../config.js';
import {
    validationResponse,
    successResponse,
    errorResponse,
} from '../utils/handleServerResponse.js';
import * as teacherService from './service.js';
import globalErrorHandler from '../utils/globalErrorHandler.js';

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const { error } = registerValidationSchema.validate(req.body);
        if (error) {
            const responseData = validationResponse(error.message);
            return res.status(200).json(responseData);
        }
        const existingUser = await teacherService.getUserByEmail(email);
        if (existingUser) {
            const responseData = errorResponse(401, 'User already exists');
            return res.status(200).json(responseData);
        } else {
            const hashedPassword = await passwordEncrypt(password);
            const newUser = await teacherService.createNewUser({
                name,
                email,
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
        const { email, password } = req.body;
        const { error } = loginValidationSchema.validate(req.body);
        if (error) {
            const responseData = validationResponse(error.message);
            return res.status(200).json(responseData);
        }
        const user = await teacherService.getUserByEmail(email);
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
                email: user.email,
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
                email: user.email,
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

export { register, login };
