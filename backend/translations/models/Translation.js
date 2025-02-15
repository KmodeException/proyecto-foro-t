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
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    originalContent: {
        type: String,
        required: true
    },
    translatedContent: {
        type: String,
        required: true
    },
    sourceLanguage: {
        type: String,
        required: true
    },
    targetLanguage: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    votes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        voteType: {
            type: String,
            enum: ['up', 'down']
        }
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    reviewComments: {
        type: String
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reviewDate: {
        type: Date
    },
    version: {
        type: Number,
        default: 1
    },
    idioma: {
        type: String,
        required: true
    },
    archivoTraduccion: {
        type: String
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    fechaActualizacion: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Translation = mongoose.model('Translation', translationSchema);

export default Translation;