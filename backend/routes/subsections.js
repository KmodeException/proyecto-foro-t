import express from 'express';
import { subsectionsController } from '../controllers/subsections/subsectionsController.js';

/**
 * @swagger
 * /api/subsections:
 *   post:
 *     tags:
 *       - Subsections
 *     summary: Crear nuevo subapartado
 *     responses:
 *       201:
 *         description: Subapartado creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubSection'
 *       400:
 *         description: Solicitud inválida
 *   get:
 *     tags:
 *       - Subsections
 *     summary: Obtener todos los subapartados
 *     responses:
 *       200:
 *         description: Lista de subapartados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SubSection'
 */

const router = express.Router();

router.post('/', subsectionsController.create);
router.get('/', subsectionsController.getAll);

export default router;