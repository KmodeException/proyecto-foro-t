import mongoose from 'mongoose';

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: API para gestión de juegos y traducciones
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       required:
 *         - title
 *         - platform
 *       properties:
 *         title:
 *           type: string
 *           description: Título del juego
 *         platform:
 *           type: array
 *           items:
 *             type: string
 *             enum: [PC, PS4, PS5, Xbox One, Xbox Series, Switch, Mobile]
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed]
 *           default: pending
 *         translationProgress:
 *           type: number
 *           minimum: 0
 *           maximum: 100
 *           default: 0
 *         translationLead:
 *           $ref: '#/components/schemas/User'
 *         translators:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 $ref: '#/components/schemas/User'
 *               assignedDate:
 *                 type: string
 *                 format: date-time
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
        type: Date,
        required: false
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
    }],
    description: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        required: false
    },
    genres: [{
        type: String,
        required: false
    }],
    fechaPublicacion: {
        type: Date,
        default: Date.now
    },
    traducciones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Traduccion'
    }],
    votos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Voto'
    }],
}, { timestamps: true });

export default mongoose.model('Game', gameSchema);