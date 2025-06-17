import * as jose from 'jose';
import { JWT_SIGNIN_PRIVATE_KEY, JWT_ENCRYPTION_PRIVATE_KEY } from '../config.js';
import { errorResponse } from '../utils/handleServerResponse.js';
import globalErrorHandler from '../utils/globalErrorHandler.js';

const verifyToken = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');

        if (token) {
            const jwtSigninKey = new TextEncoder().encode(JWT_SIGNIN_PRIVATE_KEY);
            const jwtEncryptionKey = jose.base64url.decode(JWT_ENCRYPTION_PRIVATE_KEY);

            const jwtDecryptedToken = await jose.jwtDecrypt(token, jwtEncryptionKey);

            const jwtSignedToken = await jose.jwtVerify(
                jwtDecryptedToken.payload.jwtSignedToken,
                jwtSigninKey
            );

            const currentTime = Math.floor(Date.now() / 1000);
            const expirationTime = jwtSignedToken.payload.exp;

            if (expirationTime <= currentTime) {
                const responseData = errorResponse(401, 'Invalid Token.');
                return res.status(200).json(responseData);
            }
            res.locals.decodedToken = jwtSignedToken;
            next();
        } else {
            const responseData = errorResponse(400, 'x-auth-token header is missing');
            return res.status(200).json(responseData);
        }
    } catch (error) {
        globalErrorHandler(res, error);
    }
};

export default verifyToken;
