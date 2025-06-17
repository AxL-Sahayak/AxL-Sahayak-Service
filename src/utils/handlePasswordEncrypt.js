import bcrypt from 'bcryptjs';
import { GEN_SALT } from '../config.js';

const passwordEncrypt = async (password) => {
    try {
        const genSalt = Number(GEN_SALT);
        if (
            !genSalt ||
            genSalt === null ||
            typeof genSalt !== 'number' ||
            !password ||
            password === null
        ) {
            throw new Error(
                `Invalid ${
                    !genSalt || genSalt === null || typeof genSalt !== 'number'
                        ? 'genSalt'
                        : 'password for encrypt'
                }`
            );
        }

        const salt = await bcrypt.genSalt(genSalt);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error(error.message);
    }
};

export default passwordEncrypt;
