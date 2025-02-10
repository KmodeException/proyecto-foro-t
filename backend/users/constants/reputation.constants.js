/**
 * @swagger
 * components:
 *   schemas:
 *     ReputationActions:
 *       type: object
 *       properties:
 *         TRANSLATION:
 *           type: object
 *           properties:
 *             APPROVED:
 *               type: object
 *               properties:
 *                 points:
 *                   type: number
 *                   example: 10
 *                 type:
 *                   type: string
 *                   example: "translation"
 *                 reason:
 *                   type: string
 *                   example: "Traducción aprobada"
 *             REJECTED:
 *               type: object
 *               properties:
 *                 points:
 *                   type: number
 *                   example: -5
 *                 type:
 *                   type: string
 *                   example: "translation"
 *                 reason:
 *                   type: string
 *                   example: "Traducción rechazada"
 *         FORUM:
 *           type: object
 *           properties:
 *             POST_UPVOTE:
 *               type: object
 *               properties:
 *                 points:
 *                   type: number
 *                   example: 2
 *                 type:
 *                   type: string
 *                   example: "community"
 *                 reason:
 *                   type: string
 *                   example: "Voto positivo en post"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ReputationAction:
 *       type: object
 *       properties:
 *         points:
 *           type: number
 *           description: Puntos otorgados por la acción
 *         type:
 *           $ref: '#/components/schemas/ReputationType'
 *         reason:
 *           type: string
 *           description: Razón del cambio de reputación
 */

export const REPUTATION_ACTIONS = {
    TRANSLATION: {
        APPROVED: { points: 10, type: 'translation', reason: 'Traducción aprobada' },
        REJECTED: { points: -5, type: 'translation', reason: 'Traducción rechazada' }
    },
    FORUM: {
        POST_UPVOTE: { points: 2, type: 'community', reason: 'Voto positivo en post' },
        POST_DOWNVOTE: { points: -1, type: 'community', reason: 'Voto negativo en post' }
    }
};

export const REPUTATION_LEVELS = {
    NOVICE: { min: 0, name: 'Novato' },
    CONTRIBUTOR: { min: 100, name: 'Contribuidor' },
    EXPERT: { min: 500, name: 'Experto' }
};