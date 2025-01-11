import express from 'express';
import { postController } from '../controllers/posts/postController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validatePost, handleValidationErrors } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/', postController.getAllPosts);

// Rutas protegidas
router.post('/', authenticate, validatePost.create, handleValidationErrors, postController.createPost);
router.put('/:id', authenticate, validatePost.update, handleValidationErrors, postController.updatePost);
router.delete('/:id', authenticate, postController.deletePost);

export default router;