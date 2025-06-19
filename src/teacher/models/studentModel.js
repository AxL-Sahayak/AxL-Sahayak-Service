import mongoose from 'mongoose';
const studentSchema = new mongoose.Schema(
    {
        studentName: { type: String, required: true, trim: true },
        PEN: { type: String, required: true, unique: true, trim: true },
        className: { type: String, required: true, trim: true },
        section: { type: String, required: true, trim: true },
        isActive: { type: Boolean, default: true },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'teacher',
            required: true,
        },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const StudentModel = mongoose.model('student', studentSchema);
