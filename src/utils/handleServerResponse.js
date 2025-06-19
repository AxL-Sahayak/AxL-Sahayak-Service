import { uid } from 'uid';

const successResponse = (responseMessage, data) => {
    return {
        result: 'Success',
        responseObj: {
            responseId: uid(16),
            responseTs: `${Math.floor(Date.now() / 1000)}`,
            responseApiVersion: 'v1',
            responseCode: 200,
            responseMessage: responseMessage,
            responseDataParams: {
                data: data,
            },
        },
    };
};

const validationResponse = (validaitonMessage) => {
    return {
        result: 'Validation Error',
        responseObj: {
            responseId: uid(16),
            responseTs: `${Math.floor(Date.now() / 1000)}`,
            responseApiVersion: 'v1',
            responseCode: 400,
            responseMessage: validaitonMessage,
        },
    };
};

const errorResponse = (code, errorMessage) => {
    return {
        result: 'Error',
        responseObj: {
            responseId: uid(16),
            responseTs: `${Math.floor(Date.now() / 1000)}`,
            responseApiVersion: 'v1',
            responseCode: code,
            responseMessage: errorMessage,
        },
    };
};

export { successResponse, validationResponse, errorResponse };
