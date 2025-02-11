/**
 * @swagger
 * components:
 *   schemas:
 *     ForumComment:
 *       type: object
 *       required:
 *         - content
 *         - author
 *         - post
 *       properties:
 *         content:
 *           type: string
 *           description: Contenido del comentario
 *         author:
 *           $ref: '#/components/schemas/User'
 *         post:
 *           $ref: '#/components/schemas/ForumPost'
 *         parentComment:
 *           $ref: '#/components/schemas/ForumComment'
 *         votes:
 *           type: object
 *           properties:
 *             up:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             down:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
import mongoose from 'mongoose';

const forumCommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, 'El contenido es requerido'],
        trim: true,
        minlength: [3, 'Mínimo 3 caracteres']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumPost',
        required: true
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ForumComment'
    },
    votes: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        type: {
            type: String,
            enum: ['up', 'down'],
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { 
    timestamps: true,
    toJSON: { virtuals: true }
});

forumCommentSchema.virtual('replies', {
    ref: 'ForumComment',
    localField: '_id',
    foreignField: 'parentComment'
});

export default mongoose.model('ForumComment', forumCommentSchema); 