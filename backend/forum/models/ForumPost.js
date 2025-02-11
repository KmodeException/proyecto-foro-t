/**
 * @swagger
 * components:
 *   schemas:
 *     ForumPost:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *         - thread
 *       properties:
 *         title:
 *           type: string
 *           description: Título del post
 *         content:
 *           type: string
 *           description: Contenido del post
 *         author:
 *           $ref: '#/components/schemas/User'
 *           description: Usuario que creó el post
 *         thread:
 *           $ref: '#/components/schemas/Thread'
 *           description: Hilo al que pertenece el post
 *         votes:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               userId:
 *                 $ref: '#/components/schemas/User'
 *               type:
 *                 type: string
 *                 enum: [up, down]
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
import mongoose from 'mongoose';

const forumPostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    thread: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
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
}, { timestamps: true });

const ForumPost = mongoose.model('ForumPost', forumPostSchema);
export default ForumPost;