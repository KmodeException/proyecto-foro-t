import express from 'express';
import { forumPostController } from '../../controllers/forum/forumPostController.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { postValidator } from '../../validators/forum/post.validator.js';

/**
 * @swagger
 * /api/forum/posts:
 *   post:
 *     tags: [Forum]
 *     summary: Crear nuevo post en hilo
 *     security:
 *       - BearerAuth: []
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
 *               threadId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post creado exitosamente
 *       403:
 *         description: Karma insuficiente
 * 
 * /api/forum/posts/{threadId}:
 *   get:
 *     tags: [Forum]
 *     summary: Obtener posts de un hilo
 *     parameters:
 *       - in: path
 *         name: threadId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ForumPost'
 */

const router = express.Router();

router.post('/', 
    authenticate, 
    postValidator.create,
    forumPostController.create
);
router.get('/thread/:threadId', forumPostController.getByThread);
router.post('/:id/vote',
    authenticate,
    postValidator.vote,
    forumPostController.vote
);

export default router;