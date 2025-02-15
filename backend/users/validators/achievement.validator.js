import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../common/middleware/validationMiddleware.js';

export const achievementValidator = {
    create: [
        body('name')
            .trim()
            .notEmpty()
            .withMessage('El nombre del logro es requerido')
            .isLength({ max: 255 })
            .withMessage('El nombre del logro no puede tener más de 255 caracteres'),
        body('description')
            .trim()
            .notEmpty()
            .withMessage('La descripción del logro es requerida'),
        body('condition')
            .trim()
            .notEmpty()
            .withMessage('La condición para obtener el logro es requerida'),
        handleValidationErrors
    ],
    update: [
        param('id').isMongoId().withMessage('ID de logro inválido'),
        body('name')
            .optional()
            .trim()
            .isLength({ max: 255 })
            .withMessage('El nombre del logro no puede tener más de 255 caracteres'),
        body('description')
            .optional()
            .trim(),
        body('condition')
            .optional()
            .trim(),
        handleValidationErrors
    ]
}; 