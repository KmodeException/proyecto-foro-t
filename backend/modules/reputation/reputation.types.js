/**
 * @swagger
 * components:
 *   schemas:
 *     ReputationType:
 *       type: string
 *       enum: [translation, community, moderation]
 *       description: Tipos de acciones que afectan la reputación
 *     
 *     ReputationLevel:
 *       type: object
 *       required:
 *         - name
 *         - minPoints
 *       properties:
 *         name:
 *           type: string
 *           enum: [Novato, Contribuidor, Experto]
 *           description: Nivel del usuario basado en puntos
 *         minPoints:
 *           type: number
 *           description: Puntos mínimos requeridos para el nivel
 *         permissions:
 *           type: object
 *           properties:
 *             canCreateThreads:
 *               type: boolean
 *               description: Puede crear hilos en el foro
 *             canComment:
 *               type: boolean
 *               description: Puede comentar en posts
 *             canVote:
 *               type: boolean
 *               description: Puede votar en el foro
 *     
 *     ReputationHistory:
 *       type: object
 *       properties:
 *         action:
 *           $ref: '#/components/schemas/ReputationType'
 *         points:
 *           type: number
 *         timestamp:
 *           type: string
 *           format: date-time
 */

export const ReputationTypes = {
    TRANSLATION: 'translation',
    COMMUNITY: 'community',
    MODERATION: 'moderation'
};

export const ReputationLevels = {
    NOVICE: {
        name: 'Novato',
        minPoints: 0,
        permissions: {
            canCreateThreads: true,
            canComment: true,
            canVote: true
        }
    },
    CONTRIBUTOR: {
        name: 'Contribuidor',
        minPoints: 100,
        permissions: {
            canCreateThreads: true,
            canComment: true,
            canVote: true
        }
    },
    EXPERT: {
        name: 'Experto',
        minPoints: 500,
        permissions: {
            canCreateThreads: true,
            canComment: true,
            canVote: true
        }
    }
};