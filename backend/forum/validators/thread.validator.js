import { body, validationResult } from 'express-validator';
import { handleValidationErrors } from '../../common/middleware/validationMiddleware.js';

export const threadValidator = {
    create: [
        body('name')
            .trim()
            .isLength({ min: 3, max: 50 })
            .withMessage('El nombre del hilo debe tener entre 3 y 50 caracteres'),
        body('description')
            .trim()
            .isLength({ max: 200 })
            .withMessage('La descripción no debe superar los 200 caracteres'),
        body('type')
            .isIn(['official', 'community'])
            .withMessage('Tipo de hilo inválido'),
        handleValidationErrors
    ],

    update: [
        body('name')
            .optional()
            .trim()
            .isLength({ min: 3, max: 50 })
            .withMessage('El nombre del hilo debe tener entre 3 y 50 caracteres'),
        body('description')
            .optional()
            .trim()
            .isLength({ max: 200 })
            .withMessage('La descripción no debe superar los 200 caracteres'),
        body('type')
            .optional()
            .isIn(['official', 'community'])
            .withMessage('Tipo de hilo inválido'),
        handleValidationErrors
    ]
}; 