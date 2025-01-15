import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

export const postValidators = {
    create: [
        body('title')
            .trim()
            .isLength({ min: 5, max: 100 })
            .withMessage('El título debe tener entre 5 y 100 caracteres'),
        body('content')
            .trim()
            .isLength({ min: 10 })
            .withMessage('El contenido debe tener mínimo 10 caracteres'),
        body('subsectionId')
            .isMongoId()
            .withMessage('ID de subsección inválido'),
        handleValidationErrors
    ]
};