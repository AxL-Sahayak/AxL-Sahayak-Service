import { errorResponse } from '../utils/handleServerResponse.js';
import globalErrorHandler from '../utils/globalErrorHandler.js';

const authorizeUser = (req, res, next) => {
    try {
        const isAdmin = res.locals.decodedToken.payload.isAdmin;

        if (isAdmin === false) {
            const responseData = errorResponse(401, 'Unauthorized access to the user');
            return res.status(200).json(responseData);
        }
        next();
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

export default authorizeUser;
