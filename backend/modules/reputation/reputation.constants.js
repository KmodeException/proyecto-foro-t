export const REPUTATION_ACTIONS = {
    TRANSLATION: {
        APPROVED: { points: 10, type: 'translation', reason: 'Traducción aprobada' },
        REJECTED: { points: -5, type: 'translation', reason: 'Traducción rechazada' }
    },
    COMMUNITY: {
        POST_UPVOTE: { points: 2, type: 'community', reason: 'Post votado positivamente' },
        POST_DOWNVOTE: { points: -1, type: 'community', reason: 'Post votado negativamente' },
        COMMENT_UPVOTE: { points: 1, type: 'community', reason: 'Comentario votado positivamente' },
        COMMENT_DOWNVOTE: { points: -1, type: 'community', reason: 'Comentario votado negativamente' }
    },
    MODERATION: {
        WARN: { points: -3, type: 'moderation', reason: 'Advertencia de moderador' },
        REPORT_ACCEPTED: { points: -5, type: 'moderation', reason: 'Reporte aceptado' }
    }
};

export const REPUTATION_LEVELS = {
    NOVICE: { min: 0, max: 100, name: 'Novato' },
    CONTRIBUTOR: { min: 101, max: 500, name: 'Contribuidor' },
    EXPERT: { min: 501, max: null, name: 'Experto' }
};