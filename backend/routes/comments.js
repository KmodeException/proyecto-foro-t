import express from 'express';
import { commentController } from '../controllers/comments/commentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API para gestión de comentarios
 */
const router = express.Router();

/**
 * @swagger
 * /api/comments:
 *   post:
 *     tags: [Comments]
 *     summary: Crear nuevo comentario
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               postId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
 */
router.post('/', authenticate, commentController.create);

/**
 * @swagger
 * /api/comments/{postId}:
 *   get:
 *     tags: [Comments]
 *     summary: Obtener comentarios por post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */
router.get('/:postId', commentController.getByPost);

export default router;