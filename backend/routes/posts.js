// backend/routes/posts.js
import express from 'express';
import { postController } from '../controllers/posts/postController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', postController.getAllPosts);

// Rutas protegidas
router.post('/', authenticate, postController.createPost);
router.put('/:id', authenticate, postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);

export default router;