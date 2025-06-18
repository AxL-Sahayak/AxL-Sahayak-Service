import express from 'express';
import verifyToken from '../middlewares/token.js';
import authUser from '../middlewares/auth.js';
import {
    register,
    login,
    getStudentByPEN,
    addSingleStudent,
    addLanguage,
    getAllLanguage,
} from './controller.js';

const router = express.Router();

router.post('/register', verifyToken, authUser, register);

router.post('/login', login);

router.get('/getStudentByPEN', verifyToken, authUser, getStudentByPEN);

router.post('/addSingleStudent', verifyToken, addSingleStudent);

router.post('/addLanguage', verifyToken, authUser, addLanguage);

router.get('/getAllLanguage', verifyToken, authUser, getAllLanguage);

export default router;
