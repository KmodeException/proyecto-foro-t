import { body, param, validationResult } from 'express-validator';

/**
 * Middleware de validación para posts
 */
export const validatePost = {
    create: [
        body('title')
            .trim()
            .isLength({ min: 3, max: 100 })
            .withMessage('El título debe tener entre 3 y 100 caracteres'),
        
        body('content')
            .trim()
            .isLength({ min: 10 })
            .withMessage('El contenido debe tener al menos 10 caracteres'),
        
        body('subSection')
            .notEmpty()
            .withMessage('El subapartado es obligatorio')
    ],

    update: [
        param('postId')
            .notEmpty()
            .withMessage('El ID del post es obligatorio'),
        
        body('title')
            .optional()
            .trim()
            .isLength({ min: 3, max: 100 })
            .withMessage('El título debe tener entre 3 y 100 caracteres'),
        
        body('content')
            .optional()
            .trim()
            .isLength({ min: 10 })
            .withMessage('El contenido debe tener al menos 10 caracteres')
    ]
};

/**
 * Middleware para manejar errores de validación
 */
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Error de validación',
            details: errors.array()
        });
    }
    next();
}; 