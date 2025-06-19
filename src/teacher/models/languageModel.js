import mongoose from 'mongoose';
const languageSchema = new mongoose.Schema(
    {
        languageName: { type: String, required: true, trim: true, unique: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

export const LanguageModel = mongoose.model('language', languageSchema);
