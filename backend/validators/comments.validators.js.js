import { body, param } from 'express-validator';
import { handleValidationErrors } from '../validationMiddleware.js';

export const validateComment = {
    create: [
        body('content')
            .trim()
            .isLength({ min: 3, max: 1000 })
            .withMessage('El comentario debe tener entre 3 y 1000 caracteres'),
        
        body('postId')
            .notEmpty()
            .withMessage('El ID del post es obligatorio')
            .isMongoId()
            .withMessage('ID de post inválido'),

        handleValidationErrors
    ]
};