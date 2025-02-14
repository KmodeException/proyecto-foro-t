/**
 * @swagger
 * components:
 *   schemas:
 *     ReputationUpdate:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: ID del usuario a actualizar
 *         action:
 *           $ref: '#/components/schemas/ReputationAction'
 *         sourceId:
 *           type: string
 *           description: ID de la fuente que generó el cambio
 *     
 *     ReputationResponse:
 *       type: object
 *       properties:
 *         currentPoints:
 *           type: number
 *         level:
 *           type: string
 *           enum: [Novato, Contribuidor, Experto]
 *         history:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ReputationHistory'
 *     ReputationUpdate:
 *       type: object
 *       properties:
 *         points:
 *           type: number
 *         type:
 *           type: string
 *           enum: [translation, community, moderation]
 *         reason:
 *           type: string
 *     ReputationHistory:
 *       type: object
 *       properties:
 *         history:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ReputationUpdate'
 *         currentKarma:
 *           type: number
 */

import User from '../models/User.js';
import { REPUTATION_ACTIONS, REPUTATION_LEVELS } from '../constants/reputation.constants.js';
import { ReputationTypes } from '../constants/reputation.types.js';

export const ReputationService = {
    initializeReputation: async (userId) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            user.reputation = 0;
            await user.save();
        } catch (error) {
            console.error('Error al inicializar la reputación:', error.message);
            throw error;
        }
    },

    updateReputation: async (userId, amount) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }
            user.reputation += amount;
            await user.save();
        } catch (error) {
            console.error('Error al actualizar la reputación:', error.message);
            throw error;
        }
    },

    checkRestrictions: (reputation) => {
        const canCreateThreads = reputation >= 5;
        const canComment = reputation >= 0;
        const readOnly = reputation < -10;
        const canCreateTranslation = reputation >= 10;

        return {
            canCreateThreads,
            canComment,
            readOnly,
            canCreateTranslation
        };
    }
};
