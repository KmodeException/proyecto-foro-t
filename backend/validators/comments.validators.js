import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

export const commentValidators = {
    create: [
        body('content')
            .trim()
            .isLength({ min: 3, max: 1000 })
            .withMessage('El comentario debe tener entre 3 y 1000 caracteres'),
        body('postId')
            .isMongoId()
            .withMessage('ID de post inválido'),
        handleValidationErrors
    ]
};