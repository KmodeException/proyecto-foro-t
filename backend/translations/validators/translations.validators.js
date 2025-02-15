import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../common/middleware/validationMiddleware.js';
import Joi from 'joi';

const create = (req, res, next) => {
    const schema = Joi.object({
        videojuego: Joi.string().required(),
        idioma: Joi.string().required(),
        traductor: Joi.string().required(),
        estado: Joi.string().valid('pendiente', 'en_progreso', 'revisado', 'finalizado'),
        archivoTraduccion: Joi.string(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const update = (req, res, next) => {
    const schema = Joi.object({
        videojuego: Joi.string(),
        idioma: Joi.string(),
        traductor: Joi.string(),
        estado: Joi.string().valid('pendiente', 'en_progreso', 'revisado', 'finalizado'),
        archivoTraduccion: Joi.string(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

const review = (req, res, next) => {
    const schema = Joi.object({
        estado: Joi.string().valid('aprobado', 'rechazado').required(),
        comentarios: Joi.string(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

export const translationValidators = {
    create,
    update,
    review
};