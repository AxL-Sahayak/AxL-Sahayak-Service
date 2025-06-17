import { TeacherModel } from './model.js';

const createNewUser = async (data) => {
    return await TeacherModel.create(data);
};

const getUserByEmail = async (email) => {
    return await TeacherModel.findOne({ email: email });
};

export { createNewUser, getUserByEmail };
