/**
 * @swagger
 * components:
 *   schemas:
 *     ReputationType:
 *       type: string
 *       enum: [translation, community, moderation]
 *     ReputationLevel:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           enum: [Novato, Contribuidor, Experto]
 *         minPoints:
 *           type: number
 *         permissions:
 *           type: object
 *           properties:
 *             canCreateThreads:
 *               type: boolean
 *             canComment:
 *               type: boolean
 *             canVote:
 *               type: boolean
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