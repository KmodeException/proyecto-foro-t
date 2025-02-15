import { body, query, param } from 'express-validator';
import xss from 'xss';

// Sanitización para body
const sanitizeBody = (field) => {
    return body(field).customSanitizer(value => {
        if (typeof value === 'string') {
            return xss(value);
        }
        return value;
    });
};

// Sanitización para query
const sanitizeQuery = (field) => {
    return query(field).customSanitizer(value => {
        if (typeof value === 'string') {
            return xss(value);
        }
        return value;
    });
};

// Sanitización para params
const sanitizeParams = (field) => {
    return param(field).customSanitizer(value => {
        if (typeof value === 'string') {
            return xss(value);
        }
        return value;
    });
};

export const sanitizeMiddleware = {
    sanitizeBody,
    sanitizeQuery,
    sanitizeParams
}; 