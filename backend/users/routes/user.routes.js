import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { authenticate } from '../../auth/middleware/authMiddleware.js'; // Asegúrate de que este middleware esté disponible

const router = express.Router();

// Ruta para obtener el perfil de usuario
router.get('/:id', authenticate, getUserProfile);

// Ruta para actualizar el perfil de usuario
router.put('/:id', authenticate, updateUserProfile);

export default router;