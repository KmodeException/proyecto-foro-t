import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../common/middleware/validationMiddleware.js';
import Joi from 'joi';

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
    ],

    update: [
        param('id')
            .isMongoId()
            .withMessage('ID de juego inválido'),
        body('title')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('El título es requerido'),
        body('description')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('La descripción es requerida'),
        body('genre')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('El género es requerido'),
        body('platform')
            .optional()
            .isArray()
            .withMessage('Las plataformas deben ser un array')
            .custom(platforms => {
                const validPlatforms = ['PC', 'PS4', 'PS5', 'Xbox One', 'Xbox Series', 'Switch', 'Mobile'];
                return platforms.every(p => validPlatforms.includes(p));
            })
            .withMessage('Plataforma(s) inválida(s)'),
        body('developer')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('El desarrollador es requerido'),
        body('publisher')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('El publicador es requerido'),
        body('releaseDate')
            .optional()
            .isISO8601()
            .withMessage('La fecha de lanzamiento debe ser una fecha válida'),
        body('imageUrl')
            .optional()
            .isURL()
            .withMessage('La URL de la imagen debe ser una URL válida'),
        handleValidationErrors
    ]
};

const gameSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    genre: Joi.string().required(),
    platform: Joi.string().required(),
    developer: Joi.string().required(),
    publisher: Joi.string().required(),
    releaseDate: Joi.date().required(),
    imageUrl: Joi.string().uri().required()
});

export default gameSchema; 