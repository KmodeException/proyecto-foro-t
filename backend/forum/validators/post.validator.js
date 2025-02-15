import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../common/middleware/validationMiddleware.js';
import Joi from 'joi';

const create = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        content: Joi.string().required(),
        thread: Joi.string().required()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const update = (req, res, next) => {
    const schema = Joi.object({
        title: Joi.string(),
        content: Joi.string()
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

export const postValidators = {
    create,
    update
};

export const postValidator = {
    create: [
        body('title')
            .trim()
            .notEmpty()
            .withMessage('El título es requerido')
            .isLength({ max: 255 })
            .withMessage('El título no debe exceder los 255 caracteres'),
        body('content')
            .trim()
            .notEmpty()
            .withMessage('El contenido es requerido'),
        handleValidationErrors
    ],
    update: [
        param('id')
            .isMongoId()
            .withMessage('ID de post inválido'),
        body('title')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('El título es requerido')
            .isLength({ max: 255 })
            .withMessage('El título no debe exceder los 255 caracteres'),
        body('content')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('El contenido es requerido'),
        handleValidationErrors
    ],
    getById: [
        param('id')
            .isMongoId()
            .withMessage('ID de post inválido'),
        handleValidationErrors
    ],
    delete: [
        param('id')
            .isMongoId()
            .withMessage('ID de post inválido'),
        handleValidationErrors
    ]
};