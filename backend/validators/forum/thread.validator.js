import { body } from 'express-validator';
import { handleValidationErrors } from '../../middleware/validationMiddleware.js';

export const threadValidator = {
    create: [
        body('name')
            .trim()
            .isLength({ min: 3, max: 50 })
            .withMessage('El nombre debe tener entre 3 y 50 caracteres'),
        body('description')
            .trim()
            .isLength({ min: 10, max: 500 })
            .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
        handleValidationErrors
    ]
};