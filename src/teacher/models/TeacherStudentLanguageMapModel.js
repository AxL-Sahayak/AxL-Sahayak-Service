import mongoose from 'mongoose';
const teacherStudentLanguageMapSchema = new mongoose.Schema(
    {
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'teacher',
            required: true,
        },
        penId: {
            type: String,
            required: true,
        },
        languages: {
            type: [String],
            required: true,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

teacherStudentLanguageMapSchema.index({ teacherId: 1, penId: 1 }, { unique: true });

export const TeachMapModel = mongoose.model(
    'teacher_student_language_map',
    teacherStudentLanguageMapSchema
);
