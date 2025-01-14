import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - title
 *         - platform
 */

const gameSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        unique: true
    },
    platform: [{
        type: String,
        required: true,
        enum: ['PC', 'PS4', 'PS5', 'Xbox One', 'Xbox Series', 'Switch', 'Mobile']
    }],
    releaseDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['pending', 'in_progress', 'completed'],
        default: 'pending'
    },
    translationProgress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    translationLead: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    translators: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        assignedDate: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

export default mongoose.model('Game', gameSchema);