// backend/routes/posts.js
import express from 'express';
import { postController } from '../controllers/posts/postController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Rutas para gestión de posts
 * @module routes/posts
 */

// Rutas protegidas
router.post('/', authenticate, postController.createPost);
router.get('/:subSectionId', postController.getPostsBySubSection);
router.get('/post/:postId', postController.getPostById);
router.put('/post/:postId', authenticate, postController.updatePost);
router.delete('/post/:postId', authenticate, postController.deletePost);

export default router;