import express from 'express';
import { subSectionController } from '../controllers/subsections/subSectionController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateSubSection, handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * Rutas para gestión de subapartados
 * @module routes/subsections
 */

// Rutas públicas
router.get('/', 
    validateSubSection.filters,
    handleValidationErrors,
    subSectionController.getAllSubSections
);

router.get('/path/*',
    validateSubSection.getByPath,
    handleValidationErrors,
    subSectionController.getSubSectionByPath
);

// Rutas protegidas
router.post('/',
    authenticate,
    validateSubSection.create,
    handleValidationErrors,
    subSectionController.createSubSection
);

export { router as default }; 