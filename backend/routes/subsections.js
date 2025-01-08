import express from 'express';
import { subSectionController } from '../controllers/subsections/subSectionController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Rutas para gestión de subapartados
 * @module routes/subsections
 */

// Rutas públicas
router.get('/', subSectionController.getAllSubSections);
router.get('/:path', subSectionController.getSubSectionByPath);

// Rutas protegidas
router.post('/', authenticate, subSectionController.createSubSection);

export { router as default }; 