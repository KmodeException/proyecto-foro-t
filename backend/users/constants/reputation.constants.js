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

export const REPUTATION_VALUES = {
    // Acciones de comunidad (posts, comentarios, votos)
    COMMUNITY: {
        POST_UPVOTE: 5,
        POST_DOWNVOTE: -3,
        COMMENT_UPVOTE: 3,
        COMMENT_DOWNVOTE: -2,
        POST_CREATE: 2,
        COMMENT_CREATE: 1
    },

    // Acciones de traducción (envío, aprobación, etc.)
    TRANSLATION: {
        TRANSLATION_SUBMIT: 10,
        TRANSLATION_APPROVE: 20,
        TRANSLATION_REJECT: -15
    },

    // Acciones de moderación (reportes, etc.)
    MODERATION: {
        REPORT_VALID: 5,
        REPORT_INVALID: -2,
        CONTENT_DELETE: -10
    }
};

export const LEVEL_THRESHOLDS = {
    1: 0,    // Novato
    2: 25,   // Aprendiz
    3: 50,   // Intermedio
    4: 100,  // Avanzado
    5: 200,  // Experto
    6: 400,  // Maestro
    7: 800,  // গুরু (Guru)
    8: 1600, // Легенда (Leyenda)
    9: 3200, // 神 (Dios)
};