import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../common/middleware/validationMiddleware.js';

export const postValidator = {
    create: [
        body('titulo')
            .trim()
            .notEmpty()
            .withMessage('El título es requerido')
            .isLength({ max: 255 })
            .withMessage('El título no debe exceder los 255 caracteres'),
        body('contenido')
            .trim()
            .notEmpty()
            .withMessage('El contenido es requerido'),
        handleValidationErrors
    ],
    update: [
        param('id')
            .isMongoId()
            .withMessage('ID de post inválido'),
        body('titulo')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('El título es requerido')
            .isLength({ max: 255 })
            .withMessage('El título no debe exceder los 255 caracteres'),
        body('contenido')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('El contenido es requerido'),
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