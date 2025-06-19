import mongoose from 'mongoose';
import logger from './utils/handleServerLog.js';

const connectToDatabase = async (url) => {
    try {
        if (!url) {
            throw new Error('Mongodb url not provided');
        }

        const options = {
            autoIndex: true,
            serverSelectionTimeoutMS: 5000,
        };

        await mongoose.connect(url, options);
        console.log('Database connected');
        logger.log('info', 'Database connected');
    } catch (error) {
        throw new Error(`Database connection error: ${error.message}`);
    }
};

export default connectToDatabase;
