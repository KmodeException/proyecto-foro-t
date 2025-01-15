import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../middleware/validationMiddleware.js';

export const postValidator = {
    create: [
        body('title')
            .trim()
            .isLength({ min: 5, max: 100 })
            .withMessage('El título debe tener entre 5 y 100 caracteres'),
        body('content')
            .trim()
            .isLength({ min: 10, max: 5000 })
            .withMessage('El contenido debe tener entre 10 y 5000 caracteres'),
        body('threadId')
            .isMongoId()
            .withMessage('ID de hilo inválido'),
        handleValidationErrors
    ],
    vote: [
        param('id').isMongoId(),
        body('type').isIn(['up', 'down']),
        handleValidationErrors
    ]
};