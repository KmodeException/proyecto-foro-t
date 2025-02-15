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
import { authenticate, checkRole } from '../../auth/middleware/authMiddleware.js';
import { commentValidator } from '../validators/comment.validator.js';
import { karmaCheck } from '../../common/middleware/karmaCheck.js';
import Comment from '../models/Comment.js';

const router = express.Router();

/**
 * @swagger
 * /api/forum/comments:
 *   post:
 *     summary: Crear un nuevo comentario
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 */
router.post('/', 
    authenticate, 
    checkRole(['admin', 'moderator', 'user']),
    karmaCheck('createComment'),
    commentValidator.create,
    commentController.create
);

/**
 * @swagger
 * /api/forum/comments/{id}:
 *   get:
 *     summary: Obtener un comentario por ID
 *     tags: [Comments]
 */
router.get('/:id', commentController.getById);

/**
 * @swagger
 * /api/forum/comments/{id}:
 *   put:
 *     summary: Actualizar un comentario por ID
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 */
router.put('/:id', 
    authenticate,
    checkRole(['admin', 'moderator', 'user']),
    commentValidator.update,
    commentController.update
);

/**
 * @swagger
 * /api/forum/comments/{id}:
 *   delete:
 *     summary: Eliminar un comentario por ID
 *     tags: [Comments]
 *     security:
 *       - BearerAuth: []
 */
router.delete('/:id', 
    authenticate, 
    checkRole(['admin', 'moderator', 'user']),
    commentController.delete
);

router.post('/:id/vote',
    authenticate,
    checkRole(['admin', 'moderator', 'user']),
    commentController.vote
);

export default router;
