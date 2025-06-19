import dotenv from 'dotenv';
import path from 'path';

const envConfigFile = process.env;

if (envConfigFile.NODE_ENV !== 'prod') {
    const configFile = path.resolve(process.cwd(), '.env.dev');
    dotenv.config({ path: configFile });
} else {
    dotenv.config({ debug: true });
}

const { APP_PORT, MONGODB_URL, JWT_SIGNIN_PRIVATE_KEY, JWT_ENCRYPTION_PRIVATE_KEY, GEN_SALT } =
    envConfigFile;

export {
    envConfigFile,
    APP_PORT,
    MONGODB_URL,
    JWT_SIGNIN_PRIVATE_KEY,
    JWT_ENCRYPTION_PRIVATE_KEY,
    GEN_SALT,
};
