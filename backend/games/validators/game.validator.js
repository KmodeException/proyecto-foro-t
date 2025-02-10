import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../common/middleware/validationMiddleware.js';

export const gameValidator = {
    create: [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('El título es requerido'),
        body('platform')
            .isArray()
            .withMessage('Las plataformas deben ser un array')
            .custom(platforms => {
                const validPlatforms = ['PC', 'PS4', 'PS5', 'Xbox One', 'Xbox Series', 'Switch', 'Mobile'];
                return platforms.every(p => validPlatforms.includes(p));
            })
            .withMessage('Plataforma(s) inválida(s)'),
        handleValidationErrors
    ],

    updateStatus: [
        param('id')
            .isMongoId()
            .withMessage('ID de juego inválido'),
        body('status')
            .isIn(['pending', 'in_progress', 'completed'])
            .withMessage('Estado inválido'),
        body('translationProgress')
            .isInt({ min: 0, max: 100 })
            .withMessage('Progreso debe estar entre 0 y 100'),
        handleValidationErrors
    ],

    assignTranslator: [
        param('id')
            .isMongoId()
            .withMessage('ID de juego inválido'),
        body('translatorId')
            .isMongoId()
            .withMessage('ID de traductor inválido'),
        handleValidationErrors
    ]
}; 