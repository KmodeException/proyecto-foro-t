// backend/routes/posts.js
import express from 'express';
import { postController } from '../controllers/posts/postController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validatePost, handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

/**
 * Rutas para gestión de posts
 * @module routes/posts
 */

/**
 * @swagger
 * /posts:
 *   post:
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
 *       201:
 *         description: Post creado exitosamente
 */
router.post('/', authenticate, validatePost.create, handleValidationErrors, postController.createPost);

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
 *       200:
 *         description: Lista de posts
 */
router.get('/:subSectionId', postController.getPostsBySubSection);

router.get('/post/:postId', postController.getPostById);
router.put('/post/:postId', authenticate, validatePost.update, handleValidationErrors, postController.updatePost);
router.delete('/post/:postId', authenticate, postController.deletePost);

export default router;