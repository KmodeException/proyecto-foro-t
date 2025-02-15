import { body } from 'express-validator';
import { handleValidationErrors } from '../../common/middleware/validationMiddleware.js';

export const voteValidator = {
    create: [
        body('voteType')
            .trim()
            .notEmpty()
            .withMessage('El tipo de voto es requerido')
            .isIn(['positivo', 'negativo'])
            .withMessage('El tipo de voto debe ser "positivo" o "negativo"'),
        body('voteableType')
            .trim()
            .notEmpty()
            .withMessage('El tipo de objeto votable es requerido')
            .isIn(['Videojuego', 'Traduccion', 'Comentario', 'Post'])
            .withMessage('El tipo de objeto votable debe ser "Videojuego", "Traduccion", "Comentario" o "Post"'),
        body('voteableId')
            .trim()
            .notEmpty()
            .withMessage('El ID del objeto votable es requerido')
            .isMongoId()
            .withMessage('El ID del objeto votable debe ser un ID de MongoDB válido'),
        handleValidationErrors
    ]
}; 