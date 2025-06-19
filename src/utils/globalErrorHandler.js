import { validationResponse, errorResponse } from '../utils/handleServerResponse.js';
import logger from '../utils/handleServerLog.js';

const globalErrorHandler = (res, error) => {
    if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'prod') {
        logger.log('error', `${error} ${error.stack?.split('\n')[1]?.trim()}`);
    }

    if (error.name == 'ValidationError') {
        const responseData = validationResponse(error.message);
        return res.status(200).json(responseData);
    } else if (
        error.message == 'Invalid Compact JWE' ||
        error.message == 'Invalid Compact JWS' ||
        error.message == '"exp" claim timestamp check failed' ||
        error.message == 'decryption operation failed' ||
        error.message == 'signature verification failed'
    ) {
        const responseData = errorResponse(400, 'Invalid token');
        return res.status(200).json(responseData);
    } else if (error.message) {
        const responseData = errorResponse(400, error.message);
        return res.status(200).json(responseData);
    } else {
        const responseData = errorResponse(400, 'unknown error');
        return res.status(200).json(responseData);
    }
};

export default globalErrorHandler;
