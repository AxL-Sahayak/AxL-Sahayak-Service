import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        userName: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            trim: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

const studentSChema = new mongoose.Schema(
    {
        studentName: {
            type: String,
            required: true,
            trim: true,
        },
        PEN: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        className: {
            type: String,
            required: true,
            trim: true,
        },
        section: {
            type: String,
            required: true,
            trim: true,
        },
        language: {
            type: [String],
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'teacher',
            required: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

const languageSchema = new mongoose.Schema(
    {
        languageName: {
            type: String,
            required: true,
            trim: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

const TeacherModel = mongoose.model('teacher', teacherSchema);
const StudentModel = mongoose.model('student', studentSChema);
const LanguageModel = mongoose.model('language', languageSchema);

export { TeacherModel, StudentModel, LanguageModel };
