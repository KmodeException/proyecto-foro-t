import { body } from 'express-validator';
import { handleValidationErrors } from '../middleware/validationMiddleware.js';

export const authValidators = {
    register: [
        body('username')
            .trim()
            .isLength({ min: 3, max: 30 })
            .withMessage('El username debe tener entre 3 y 30 caracteres'),
        body('email')
            .isEmail()
            .withMessage('Email inválido'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('La contraseña debe tener mínimo 6 caracteres'),
        handleValidationErrors
    ],
    login: [
        body('email').isEmail(),
        body('password').exists(),
        handleValidationErrors
    ]
};