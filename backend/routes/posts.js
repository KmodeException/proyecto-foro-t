// backend/routes/posts.js
import express from 'express';
import { postsController } from '../controllers/posts/postsController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API de posts
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     tags: [Posts]
 *     summary: Crear un nuevo post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               subSection:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Post creado exitosamente
 *       '400':
 *         description: Solicitud inválida
 */
router.post('/', postsController.create);

/**
 * @swagger
 * /posts/{subSectionId}:
 *   get:
 *     summary: Obtener posts por subapartado
 *     parameters:
 *       - in: path
 *         name: subSectionId
 *         required: true
 *         description: ID del subapartado
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Lista de posts
 *       '404':
 *         description: No se encontraron posts
 */
router.get('/:subSectionId', postsController.getBySubSection);

export default router;