export const REPUTATION_ACTIONS = {
    TRANSLATION: {
        APPROVED: { points: 10, type: 'translation', reason: 'Traducción aprobada' },
        REJECTED: { points: -5, type: 'translation', reason: 'Traducción rechazada' }
    },
    COMMUNITY: {
        POST_UPVOTE: { points: 2, type: 'community', reason: 'Post votado positivamente' },
        POST_DOWNVOTE: { points: -1, type: 'community', reason: 'Post votado negativamente' },
        COMMENT_UPVOTE: { points: 1, type: 'community', reason: 'Comentario votado positivamente' }
    }
};