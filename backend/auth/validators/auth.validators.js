import { body } from 'express-validator';
import { handleValidationErrors } from '../../common/middleware/validationMiddleware.js';

export const authValidators = {
    register: [
        body('username')
            .trim()
            .isLength({ min: 3, max: 30 })
            .withMessage('El username debe tener entre 3 y 30 caracteres')
            .matches(/^[a-zA-Z0-9_]+$/)
            .withMessage('El username solo puede contener letras, números y guiones bajos'),
        body('email')
            .trim()
            .isEmail()
            .withMessage('Email inválido')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 6, max: 50 })
            .withMessage('La contraseña debe tener entre 6 y 50 caracteres')
            .matches(/\d/)
            .withMessage('La contraseña debe contener al menos un número'),
        handleValidationErrors
    ],
    
    login: [
        body('email')
            .trim()
            .isEmail()
            .withMessage('Email inválido')
            .normalizeEmail(),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Contraseña inválida'),
        handleValidationErrors
    ]
};