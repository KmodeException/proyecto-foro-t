import { body } from 'express-validator';
import { handleValidationErrors } from '../../common/middleware/validationMiddleware.js';

export const commentValidator = {
    create: [
        body('content')
            .trim()
            .isLength({ min: 3, max: 1000 })
            .withMessage('El comentario debe tener entre 3 y 1000 caracteres'),
        body('postId')
            .isMongoId()
            .withMessage('ID de post inválido'),
        body('parentCommentId')
            .optional()
            .isMongoId()
            .withMessage('ID de comentario padre inválido'),
        handleValidationErrors
    ],

    vote: [
        body('type')
            .isIn(['up', 'down'])
            .withMessage('Tipo de voto inválido'),
        handleValidationErrors
    ]
}; 