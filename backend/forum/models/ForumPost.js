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
    votes: {
        up: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        down: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    }
}, { timestamps: true });

const ForumPost = mongoose.model('ForumPost', forumPostSchema);
export default ForumPost;