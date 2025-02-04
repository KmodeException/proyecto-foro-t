import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - content
 *         - post
 *         - author
 *       properties:
 *         content:
 *           type: string
 *         post:
 *           type: string
 *         author:
 *           type: string
 */
const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'El contenido es requerido'],
        trim: true,
        minlength: [3, 'Mínimo 3 caracteres']
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

export default mongoose.model('Comment', CommentSchema);