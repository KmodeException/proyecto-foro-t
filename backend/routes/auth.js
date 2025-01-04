import express from 'express';
import { authController } from '../controllers/auth/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.post('/register', authController.register);
router.post('/login', authController.login);

// Rutas protegidas
router.get('/profile', authenticate, authController.getProfile);

export default router;
