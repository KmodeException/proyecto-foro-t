import { body, param } from 'express-validator';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

export const translationValidators = {
    create: [
        body('gameId')
            .isMongoId()
            .withMessage('ID de juego inválido'),
        body('originalText')
            .trim()
            .notEmpty()
            .withMessage('El texto original es requerido'),
        body('translatedText')
            .trim()
            .notEmpty()
            .withMessage('La traducción es requerida'),
        body('section')
            .isIn(['menu', 'dialogs', 'items', 'misc'])
            .withMessage('Sección inválida'),
        handleValidationErrors
    ],
    update: [
        param('id').isMongoId(),
        body('translatedText').trim().notEmpty(),
        handleValidationErrors
    ]
};