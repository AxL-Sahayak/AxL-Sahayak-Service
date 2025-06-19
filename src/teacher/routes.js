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
    getMyCohorts,
    getStudentsByCohort,
} from './controller.js';

const router = express.Router();

router.post(
    '/register',
    //  verifyToken, authUser,
    register
);

router.post('/login', login);

router.get('/getStudentByPEN', verifyToken, getStudentByPEN);

router.post('/addSingleStudent', verifyToken, addSingleStudent);

router.post('/addLanguage', verifyToken, authUser, addLanguage);

router.get('/getAllLanguages', verifyToken, getAllLanguage);

router.get('/getMyCohorts', verifyToken, getMyCohorts);

router.get('/getStudentsByCohort', verifyToken, getStudentsByCohort);

export default router;
