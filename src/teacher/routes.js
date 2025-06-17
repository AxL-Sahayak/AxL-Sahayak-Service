import express from 'express';
import verifyToken from '../middlewares/token.js';
import authUser from '../middlewares/auth.js';
import { register, login } from './controller.js';

const router = express.Router();

router.post('/register', verifyToken, authUser, register);

router.post('/login', login);

export default router;
