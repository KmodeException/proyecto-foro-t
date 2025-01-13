import express from 'express';
import { subSectionController } from '../controllers/subsections/subSectionController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Rutas para gestión de subapartados
 * @module routes/subsections
 */

/**
 * @swagger
 * /subsections:
 *   get:
 *     summary: Obtener todos los subapartados
 *     responses:
 *       200:
 *         description: Lista de subapartados
 */
router.get('/', subSectionController.getAllSubSections);
router.get('/path/*', subSectionController.getSubSectionByPath);

/**
 * @swagger
 * /subsections:
 *   post:
 *     summary: Crear un nuevo subapartado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               rules:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *     responses:
 *       201:
 *         description: Subapartado creado exitosamente
 */
router.post('/', authenticate, subSectionController.createSubSection);

export { router as default };