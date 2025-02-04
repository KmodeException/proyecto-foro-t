/**
 * @swagger
 * components:
 *   schemas:
 *     Thread:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         type:
 *           type: string
 *           enum: [official, community]
 */
import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: String,
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    type: {
        type: String,
        enum: ['official', 'community'],
        default: 'community'
    },
    rules: [String],
    moderators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

const Thread = mongoose.model('Thread', threadSchema);
export default Thread;