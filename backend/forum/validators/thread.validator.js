import { body } from 'express-validator';
import { handleValidationErrors } from '../../common/middleware/validationMiddleware.js';

export const threadValidator = {
    create: [
        body('name')
            .trim()
            .isLength({ min: 3, max: 100 })
            .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
        body('description')
            .trim()
            .isLength({ min: 10, max: 500 })
            .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
        body('type')
            .isIn(['official', 'community'])
            .withMessage('Tipo de hilo inválido'),
        handleValidationErrors
    ],

    update: [
        body('name')
            .optional()
            .trim()
            .isLength({ min: 3, max: 100 })
            .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
        body('description')
            .optional()
            .trim()
            .isLength({ min: 10, max: 500 })
            .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
        body('type')
            .optional()
            .isIn(['official', 'community'])
            .withMessage('Tipo de hilo inválido'),
        handleValidationErrors
    ]
}; 