import express from 'express';
import { postsController } from '../controllers/posts/postsController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { postValidators } from '../validators/posts.validators.js';

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
 *     summary: Crear nuevo post
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
 *               subsectionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Post creado exitosamente
 */
router.post('/', 
    authenticate, 
    postValidators.create, 
    postsController.create
);

/**
 * @swagger
 * /api/posts/subsection/{subSectionId}:
 *   get:
 *     tags: [Posts]
 *     summary: Obtener posts por subsección
 *     parameters:
 *       - in: path
 *         name: subSectionId
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
 *                 $ref: '#/components/schemas/Post'
 */
router.get('/subsection/:subSectionId', postsController.getBySubSection);

export default router;