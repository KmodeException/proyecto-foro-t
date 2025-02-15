import { body } from 'express-validator';
import { handleValidationErrors } from '../../common/middleware/validationMiddleware.js';

const create = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string(),
        type: Joi.string().valid('official', 'community').default('community'),
        rules: Joi.array().items(Joi.string()),
        moderators: Joi.array().items(Joi.string())
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const update = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string(),
        description: Joi.string(),
        type: Joi.string().valid('official', 'community'),
        rules: Joi.array().items(Joi.string()),
        moderators: Joi.array().items(Joi.string())
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

export const threadValidators = {
    create,
    update
};

export const threadValidator = {
    create: [
        body('name')
            .trim()
            .isLength({ min: 3, max: 100 })
            .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
        body('description')
            .trim()
            .isLength({ min: 10, max: 500 })
            .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
        body('type')
            .isIn(['official', 'community'])
            .withMessage('Tipo de hilo inválido'),
        handleValidationErrors
    ],

    update: [
        body('name')
            .optional()
            .trim()
            .isLength({ min: 3, max: 100 })
            .withMessage('El nombre debe tener entre 3 y 100 caracteres'),
        body('description')
            .optional()
            .trim()
            .isLength({ min: 10, max: 500 })
            .withMessage('La descripción debe tener entre 10 y 500 caracteres'),
        body('type')
            .optional()
            .isIn(['official', 'community'])
            .withMessage('Tipo de hilo inválido'),
        handleValidationErrors
    ]
}; 