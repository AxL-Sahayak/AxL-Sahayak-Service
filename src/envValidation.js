import logger from './utils/handleServerLog.js';

const validateEnvFile = (envConfigFile, variablesToValidate) => {
    try {
        for (const variable of variablesToValidate) {
            if (!envConfigFile[variable]) {
                console.log(`Required environment variable "${variable}" is missing`);
                process.exit(1);
            }
        }

        if (variablesToValidate.includes('APP_PORT')) {
            const port = parseInt(envConfigFile.APP_PORT);
            console.log(port);

            if (isNaN(port) || port < 2000 || port > 9999) {
                console.log('Invalid APP_PORT number', envConfigFile.APP_PORT);
                process.exit(1);
            }
        }
        if (variablesToValidate.includes('MONGODB_URL')) {
            const MONGODB_URL = envConfigFile.MONGODB_URL.trim();
            if (MONGODB_URL === '') {
                console.log('MONGODB_URL is empty');
                process.exit(1);
            }
        }
        if (variablesToValidate.includes('JWT_SIGNIN_PRIVATE_KEY')) {
            const JWT_SIGNIN_PRIVATE_KEY = envConfigFile.JWT_SIGNIN_PRIVATE_KEY.trim();
            if (JWT_SIGNIN_PRIVATE_KEY === '') {
                console.log('JWT_SIGNIN_PRIVATE_KEY is empty');
                process.exit(1);
            }
        }
        if (variablesToValidate.includes('JWT_ENCRYPTION_PRIVATE_KEY')) {
            const JWT_ENCRYPTION_PRIVATE_KEY = envConfigFile.JWT_ENCRYPTION_PRIVATE_KEY.trim();
            if (JWT_ENCRYPTION_PRIVATE_KEY === '') {
                console.log('JWT_ENCRYPTION_PRIVATE_KEY is empty');
                process.exit(1);
            }
        }
        if (variablesToValidate.includes('GEN_SALT')) {
            const GEN_SALT = parseInt(envConfigFile.GEN_SALT);
            if (isNaN(GEN_SALT) || GEN_SALT < 1 || GEN_SALT > 10) {
                console.log('Invalid GEN_SALT value');
                process.exit(1);
            }
        }
    } catch (error) {
        logger.log('error', `${error} ${error.stack?.split('\n')[1]?.trim()}`);
        process.exit(1);
    }
};

export default validateEnvFile;
