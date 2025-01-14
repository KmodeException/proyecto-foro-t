import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - creator
 *         - subSection
 *       properties:
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         creator:
 *           type: string
 *           format: uuid
 *         subSection:
 *           type: string
 *           format: uuid
 * /api/posts:
 *   post:
 *     security:
 *       - bearerAuth: []
 */

/**
 * Esquema para los posts dentro de los subapartados
 */
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        maxlength: [100, 'El título no puede exceder 100 caracteres']
    },
    content: {
        type: String,
        required: [true, 'El contenido es obligatorio'],
        minlength: [10, 'El contenido debe tener al menos 10 caracteres']
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subSection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubSection',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);
export default Post;