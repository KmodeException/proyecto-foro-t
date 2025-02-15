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
import { REPUTATION_VALUES, LEVEL_THRESHOLDS } from '../constants/reputation.constants.js';

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

    updateReputation: async (userId, action, sourceId) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('Usuario no encontrado');
            }

            let reputationChange = REPUTATION_VALUES[action];
            if (reputationChange === undefined) {
                throw new Error(`Acción de reputación no válida: ${action}`);
            }

            user.reputation += reputationChange;
            user.reputation = Math.max(0, user.reputation); // Evitar reputación negativa

            // Actualizar el nivel del usuario
            user.level = ReputationService.calculateLevel(user.reputation);

            await user.save();
            console.log(`Reputación de usuario ${userId} actualizada por acción ${action}. Nueva reputación: ${user.reputation}, Nivel: ${user.level}`);
        } catch (error) {
            console.error("Error al actualizar la reputación:", error);
            throw error;
        }
    },

    calculateLevel: (reputation) => {
        let level = 1;
        for (const [lvl, threshold] of Object.entries(LEVEL_THRESHOLDS)) {
            if (reputation >= threshold) {
                level = parseInt(lvl);
            } else {
                break;
            }
        }
        return level;
    },

    checkRestrictions: (reputation) => {
        const level = ReputationService.calculateLevel(reputation);
        return {
            readOnly: level < 2,
            noComments: level < 3,
            noPosts: level < 4
        };
    }
};
