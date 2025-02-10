import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../common/middleware/validationMiddleware.js';

export const postValidator = {
    create: [
        body('title')
            .trim()
            .isLength({ min: 5, max: 100 })
            .withMessage('El título debe tener entre 5 y 100 caracteres'),
        body('content')
            .trim()
            .isLength({ min: 10, max: 10000 })
            .withMessage('El contenido debe tener entre 10 y 10000 caracteres'),
        body('threadId')
            .isMongoId()
            .withMessage('ID de hilo inválido'),
        handleValidationErrors
    ],
    
    update: [
        body('title')
            .optional()
            .trim()
            .isLength({ min: 5, max: 100 })
            .withMessage('El título debe tener entre 5 y 100 caracteres'),
        body('content')
            .optional()
            .trim()
            .isLength({ min: 10, max: 10000 })
            .withMessage('El contenido debe tener entre 10 y 10000 caracteres'),
        handleValidationErrors
    ],

    vote: [
        body('type')
            .isIn(['up', 'down'])
            .withMessage('Tipo de voto inválido'),
        handleValidationErrors
    ]
};