import express from 'express';
import { commentController } from '../controllers/comments/commentController.js';
import { authenticate } from '../middleware/auth.js';

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
 *     summary: Crear nuevo comentario
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticate, commentController.create);

/**
 * @swagger
 * /api/comments/post/{postId}:
 *   get:
 *     summary: Obtener comentarios por post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/post/:postId', commentController.getByPost);

export default router;