import { TeacherModel, StudentModel, LanguageModel } from './model.js';

const createNewUser = async (data) => {
    return await TeacherModel.create(data);
};

const getUserByEmail = async (userName) => {
    return await TeacherModel.findOne({ userName: userName });
};

const getStudentByPEN = async (pen) => {
    return await StudentModel.findOne({ PEN: pen });
};

const addStudent = async (data) => {
    return await StudentModel.create(data);
};

const addLanguage = async (data) => {
    return await LanguageModel.create(data);
};

const getLanguage = async (languageName) => {
    return await LanguageModel.findOne({ languageName: languageName });
};

const getAllLanguages = async () => {
    return await LanguageModel.find({}, { createdAt: 0, updatedAt: 0, isActive: 0, __v: 0 });
};

export {
    createNewUser,
    getUserByEmail,
    getStudentByPEN,
    addStudent,
    addLanguage,
    getLanguage,
    getAllLanguages,
};
