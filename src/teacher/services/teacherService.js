import { TeacherModel } from '../models/teacherModel.js';
import { LanguageModel } from '../models/languageModel.js';
import { StudentModel } from '../models/studentModel.js';
import { TeachMapModel } from '../models/TeacherStudentLanguageMapModel.js';

// User Services
const createNewUser = async (data) => {
    return await TeacherModel.create(data);
};

const getUserByEmail = async (userName) => {
    return await TeacherModel.findOne({ userName });
};

const getStudentByPEN = async (pen) => {
    return await StudentModel.findOne({ PEN: pen });
};

const addStudent = async (data) => {
    return await StudentModel.create(data);
};

const getStudentsByCreator = async (teacherId) => {
    return await StudentModel.find({ createdBy: teacherId, isActive: true });
};

// TeachMap Services (pivot)
const getTeachMapByStudentAndTeacher = async (teacherId, penId) => {
    return await TeachMapModel.findOne({ teacherId, penId });
};

const addTeachMap = async (teacherId, penId, languages) => {
    return await TeachMapModel.create({
        teacherId,
        penId,
        languages,
    });
};

const getMappedStudentPENsByTeacher = async (teacherId) => {
    const mappings = await TeachMapModel.find({ teacherId });
    return mappings.map((m) => m.penId).filter(Boolean);
};

const getStudentsByCohort = async (teacherId, className, section, language) => {
    const penIds = await TeachMapModel.find({
        teacherId,
        languages: { $in: [language] },
    }).distinct('penId');

    const students = await StudentModel.find(
        {
            PEN: { $in: penIds },
            className,
            section,
        },
        {
            _id: 0,
            createdAt: 0,
            updatedAt: 0,
            isActive: 0,
            __v: 0,
            createdBy: 0,
        }
    );

    return students;
};

// Language Services
const addLanguage = async (data) => {
    return await LanguageModel.create(data);
};

const getLanguage = async (languageName) => {
    return await LanguageModel.findOne({ languageName });
};

const getAllLanguages = async () => {
    return await LanguageModel.find(
        {},
        {
            createdAt: 0,
            updatedAt: 0,
            isActive: 0,
            __v: 0,
        }
    );
};

const getTeachMapsByTeacher = async (teacherId) => {
    return await TeachMapModel.find({ teacherId });
};

export {
    createNewUser,
    getUserByEmail,
    getStudentByPEN,
    addStudent,
    getStudentsByCreator,
    getTeachMapByStudentAndTeacher,
    addTeachMap,
    getStudentsByCohort,
    getTeachMapsByTeacher,
    addLanguage,
    getLanguage,
    getAllLanguages,
    getMappedStudentPENsByTeacher,
};
