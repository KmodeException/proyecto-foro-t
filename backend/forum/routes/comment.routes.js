/**
 * @swagger
 * /api/forum/comments:
 *   post:
 *     tags: [Forum]
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
 *               parentCommentId:
 *                 type: string
 *                 description: ID del comentario padre (opcional)
 *     responses:
 *       201:
 *         description: Comentario creado
 *       403:
 *         description: Karma insuficiente
 * 
 * /api/forum/comments/{postId}:
 *   get:
 *     tags: [Forum]
 *     summary: Obtener comentarios de un post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de comentarios
 * 
 * /api/forum/comments/{id}/vote:
 *   post:
 *     tags: [Forum]
 *     summary: Votar comentario
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [up, down]
 */

import express from 'express';
import { forumCommentController } from '../controllers/forumCommentController.js';
import { authenticate } from '../../auth/middleware/authMiddleware.js';
import { commentValidator } from '../validators/comments.validators.js';
import { karmaCheck } from '../../common/middleware/karmaCheck.js';

const router = express.Router();

// Rutas base
router.post('/', authenticate, forumCommentController.create);
router.get('/post/:postId', forumCommentController.getByPost);

// Rutas de votos
router.post('/:id/upvote', authenticate, forumCommentController.upvote);
router.post('/:id/downvote', authenticate, forumCommentController.downvote);

export default router;
