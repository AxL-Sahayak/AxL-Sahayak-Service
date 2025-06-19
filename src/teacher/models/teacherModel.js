import mongoose from 'mongoose';

const teacherSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        userName: { type: String, required: true, unique: true, trim: true },
        password: { type: String, required: true, trim: true },
        isAdmin: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const TeacherModel = mongoose.model('teacher', teacherSchema);
