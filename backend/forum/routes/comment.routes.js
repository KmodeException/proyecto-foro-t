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
import { commentController } from '../controllers/commentController.js';
import { authenticate } from '../../auth/middleware/authMiddleware.js';
import { commentValidator } from '../validators/comment.validator.js';
import { karmaCheck } from '../../common/middleware/karmaCheck.js';
import Comment from '../models/Comment.js';

const router = express.Router();

// Rutas base
router.post('/', 
    authenticate, 
    karmaCheck('createComment'),
    commentValidator.create,
    commentController.create
);

router.get('/post/:postId', commentController.getByPost);

// Rutas de votos
router.post('/:id/vote',
    authenticate,
    karmaCheck('vote'),
    commentValidator.vote,
    commentController.vote
);

export default router;
