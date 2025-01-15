import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../middleware/validationMiddleware.js';

export const commentValidator = {
    create: [
        body('content')
            .trim()
            .isLength({ min: 1, max: 1000 })
            .withMessage('El comentario debe tener entre 1 y 1000 caracteres'),
        body('postId')
            .isMongoId()
            .withMessage('ID de post inválido'),
        body('parentCommentId')
            .optional()
            .isMongoId()
            .withMessage('ID de comentario padre inválido'),
        handleValidationErrors
    ]
};