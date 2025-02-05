/**
 * @swagger
 * components:
 *   schemas:
 *     TranslationComment:
 *       type: object
 *       required:
 *         - content
 *         - translation
 *         - author
 *         - type
 */
import mongoose from 'mongoose';

const translationCommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'El contenido es requerido'],
        trim: true
    },
    translation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Translation',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['suggestion', 'correction', 'question'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true });

export default mongoose.model('TranslationComment', translationCommentSchema);