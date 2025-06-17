import express from 'express';
import cors from 'cors';
import { envConfigFile, APP_PORT, MONGODB_URL } from './config.js';
import validateEnvFile from './envValidation.js';
import connectToDatabase from './database.js';
import router from './routes.js';
import logger from './utils/handleServerLog.js';

const app = express();

const startServer = async () => {
    app.use(express.json({ limit: '4mb' }));
    app.use(cors());
    app.use('/api/v1', router);
    app.get('/', (req, res) => {
        res.status(200).json({
            message: 'Welcome to the API',
            status: 'success',
        });
    });

    validateEnvFile(envConfigFile, [
        'APP_PORT',
        'MONGODB_URL',
        'JWT_ENCRYPTION_PRIVATE_KEY',
        'JWT_SIGNIN_PRIVATE_KEY',
        'GEN_SALT',
    ]);
    await connectToDatabase(MONGODB_URL);

    return new Promise((resolve) => {
        const server = app.listen(parseInt(APP_PORT), () => {
            console.log(`Server is running on port ${APP_PORT}`);
            logger.log('info', `Server is running on port ${APP_PORT}`);
            resolve(server);
        });
    });
};
startServer();
