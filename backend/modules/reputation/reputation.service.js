/**
 * @swagger
 * components:
 *   schemas:
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

import User from '../../models/User.js';
import { REPUTATION_ACTIONS, REPUTATION_LEVELS } from './reputation.constants.js';

export class ReputationService {
    static async updateReputation(userId, action, sourceId) {
        try {
            const user = await User.findById(userId);
            if (!user) throw new Error('Usuario no encontrado');

            // Actualizar reputación
            user.reputation = (user.reputation || 0) + action.points;
            
            // Registrar historial
            if (!user.reputationHistory) user.reputationHistory = [];
            
            user.reputationHistory.push({
                points: action.points,
                type: action.type,
                reason: action.reason,
                sourceId,
                date: new Date()
            });

            // Calcular nivel
            user.level = this.calculateLevel(user.reputation);

            await user.save();
            return {
                newReputation: user.reputation,
                level: user.level
            };
        } catch (error) {
            throw new Error(`Error al actualizar reputación: ${error.message}`);
        }
    }

    static calculateLevel(reputation) {
        if (reputation <= REPUTATION_LEVELS.NOVICE.max) return REPUTATION_LEVELS.NOVICE.name;
        if (reputation <= REPUTATION_LEVELS.CONTRIBUTOR.max) return REPUTATION_LEVELS.CONTRIBUTOR.name;
        return REPUTATION_LEVELS.EXPERT.name;
    }

    static checkRestrictions(reputation) {
        return {
            canCreateThreads: reputation >= 0,
            canComment: reputation >= -10,
            readOnly: reputation < -20
        };
    }

    static async getReputationHistory(userId) {
        const user = await User.findById(userId);
        if (!user) throw new Error('Usuario no encontrado');
        return user.reputationHistory || [];
    }
}