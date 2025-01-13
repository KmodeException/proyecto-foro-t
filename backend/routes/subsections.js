import express from 'express';
import { subsectionsController } from '../controllers/subsections/subsectionsController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Subsections
 *   description: API de subapartados
 */

/**
 * @swagger
 * /api/subsections:  // Actualizar path
 *   get:
 *     tags: [Subsections]  // Añadir tag
 *     summary: Obtener todos los subapartados
 *     responses:
 *       '200':
 *         description: Lista de subapartados
 *       '404':
 *         description: No se encontraron subapartados
 */
router.get('/', subsectionsController.getAll);

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
 *       '201':
 *         description: Subapartado creado exitosamente
 *       '400':
 *         description: Solicitud inválida
 */
router.post('/', subsectionsController.create);

export default router;