import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../common/middleware/validationMiddleware.js';

export const userValidators = {
    update: [
        param('id').isMongoId().withMessage('ID de usuario inválido'),
        body('username')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('El nombre de usuario no puede estar vacío'),
        body('email')
            .optional()
            .isEmail()
            .withMessage('El correo electrónico debe ser válido'),
        body('age')
            .optional()
            .isInt({ min: 0 })
            .withMessage('La edad debe ser un número positivo'),
        handleValidationErrors
    ]
}; 