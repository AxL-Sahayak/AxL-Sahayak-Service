import express from 'express';
import teacherRoutes from './teacher/routes.js';

const router = express.Router();

router.use('/teacher', teacherRoutes);

export default router;
