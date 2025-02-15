import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../common/middleware/validationMiddleware.js';

export const threadValidator = {
    create: [
        body('titulo')
            .trim()
            .notEmpty()
            .withMessage('El título es requerido')
            .isLength({ max: 255 })
            .withMessage('El título no puede tener más de 255 caracteres'),
        body('contenido')
            .trim()
            .notEmpty()
            .withMessage('El contenido es requerido'),
        handleValidationErrors
    ],
    update: [
        param('id').isMongoId().withMessage('ID de hilo inválido'),
        body('titulo')
            .optional()
            .trim()
            .isLength({ max: 255 })
            .withMessage('El título no puede tener más de 255 caracteres'),
        body('contenido')
            .optional()
            .trim(),
        handleValidationErrors
    ]
}; 