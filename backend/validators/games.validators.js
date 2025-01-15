import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

export const gameValidators = {
    create: [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('El título es requerido'),
        body('platform')
            .isArray()
            .withMessage('Las plataformas deben ser un array'),
        handleValidationErrors
    ],
    updateStatus: [
        param('id').isMongoId(),
        body('status')
            .isIn(['pending', 'in_progress', 'completed'])
            .withMessage('Estado inválido'),
        body('translationProgress')
            .isInt({ min: 0, max: 100 })
            .withMessage('Progreso debe estar entre 0 y 100'),
        handleValidationErrors
    ]
};