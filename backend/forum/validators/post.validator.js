import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../common/middleware/validationMiddleware.js';

export const postValidator = {
    create: [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('El título es requerido')
            .isLength({ max: 255 })
            .withMessage('El título no debe exceder los 255 caracteres'),
        body('content')
            .trim()
            .notEmpty()
            .withMessage('El contenido es requerido'),
        body('thread')
            .trim()
            .notEmpty()
            .withMessage('El thread es requerido'),
        handleValidationErrors
    ],
    update: [
        param('id')
            .isMongoId()
            .withMessage('ID de post inválido'),
        body('title')
            .optional()
            .trim()
            .isLength({ max: 255 })
            .withMessage('El título no debe exceder los 255 caracteres'),
        body('content')
            .optional()
            .trim()
            .isLength({ min: 10 })
            .withMessage('El contenido debe tener al menos 10 caracteres'),
        handleValidationErrors
    ],
    getById: [
        param('id')
            .isMongoId()
            .withMessage('ID de post inválido'),
        handleValidationErrors
    ],
    delete: [
        param('id')
            .isMongoId()
            .withMessage('ID de post inválido'),
        handleValidationErrors
    ]
};