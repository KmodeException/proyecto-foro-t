/**
 * @swagger
 * components:
 *   schemas:
 *     TranslationStatus:
 *       type: string
 *       enum: [pending, approved, rejected]
 *       description: Estado actual de la traducción
 */

import mongoose from 'mongoose';

const translationSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    translator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewDate: Date,
    reviewComments: String
}, { timestamps: true });

export default mongoose.model('Translation', translationSchema);