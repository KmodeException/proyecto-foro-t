import { body } from 'express-validator';
import { handleValidationErrors } from '../../common/middleware/validationMiddleware.js';

export const commentValidator = {
    create: [
        body('content')
            .trim()
            .notEmpty()
            .withMessage('El contenido es requerido'),
        body('author')
            .trim()
            .notEmpty()
            .withMessage('El autor es requerido'),
        body('post')
            .trim()
            .notEmpty()
            .withMessage('El post es requerido'),
        handleValidationErrors
    ],
    update: [
        body('content')
            .optional()
            .trim(),
        handleValidationErrors
    ]
}; 