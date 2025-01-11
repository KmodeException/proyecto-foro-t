import { body, param, query, validationResult } from 'express-validator';

/**
 * Middleware de validación para subapartados
 */
export const validateSubSection = {
    create: [
        body('name')
            .trim()
            .isLength({ min: 3, max: 50 })
            .withMessage('El nombre debe tener entre 3 y 50 caracteres')
            .matches(/^[a-zA-Z0-9\s-]+$/)
            .withMessage('El nombre solo puede contener letras, números, espacios y guiones'),
        
        body('category')
            .isIn(['recursos', 'tutoriales', 'comunidad'])
            .withMessage('Categoría no válida'),
        
        body('description')
            .trim()
            .isLength({ min: 10, max: 500 })
            .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
        
        body('rules')
            .isArray()
            .withMessage('Las reglas deben ser un array')
            .optional(),
        
        body('rules.*.title')
            .trim()
            .isLength({ min: 3, max: 100 })
            .withMessage('El título de la regla debe tener entre 3 y 100 caracteres'),
        
        body('rules.*.description')
            .trim()
            .isLength({ min: 10, max: 500 })
            .withMessage('La descripción de la regla debe tener entre 10 y 500 caracteres'),
    ],
    
    getByPath: [
        param('*')
            .trim()
            .notEmpty()
            .withMessage('El path es requerido')
    ],
    
    filters: [
        query('category')
            .optional()
            .isIn(['recursos', 'tutoriales', 'comunidad'])
            .withMessage('Categoría no válida'),
        
        query('sort')
            .optional()
            .isIn(['name', 'recent', 'activity'])
            .withMessage('Criterio de ordenamiento no válido'),
        
        query('search')
            .optional()
            .trim()
            .isLength({ min: 2 })
            .withMessage('La búsqueda debe tener al menos 2 caracteres')
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

export const validatePost = (req, res, next) => {
    // lógica de validación
    next();
};