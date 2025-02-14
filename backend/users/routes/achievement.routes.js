import express from 'express';
import { achievementController } from '../controllers/achievementController.js';
import { authenticate, checkRole } from '../../auth/middleware/authMiddleware.js';
import { achievementValidator } from '../validators/achievement.validator.js';

const router = express.Router();

/**
 * @swagger
 * /api/achievements:
 *   post:
 *     summary: Crear un nuevo logro
 *     tags: [Achievements]
 *     security:
 *       - BearerAuth: []
 */
router.post('/', 
    authenticate, 
    checkRole(['admin']),
    achievementValidator.create,
    achievementController.create
);

/**
 * @swagger
 * /api/achievements:
 *   get:
 *     summary: Obtener todos los logros
 *     tags: [Achievements]
 */
router.get('/', achievementController.getAll);

/**
 * @swagger
 * /api/achievements/{id}:
 *   get:
 *     summary: Obtener un logro por ID
 *     tags: [Achievements]
 */
router.get('/:id', achievementController.getById);

/**
 * @swagger
 * /api/achievements/{id}:
 *   put:
 *     summary: Actualizar un logro por ID
 *     tags: [Achievements]
 *     security:
 *       - BearerAuth: []
 */
router.put('/:id', 
    authenticate, 
    checkRole(['admin']),
    achievementValidator.update,
    achievementController.update
);

/**
 * @swagger
 * /api/achievements/{id}:
 *   delete:
 *     summary: Eliminar un logro por ID
 *     tags: [Achievements]
 *     security:
 *       - BearerAuth: []
 */
router.delete('/:id', 
    authenticate, 
    checkRole(['admin']),
    achievementController.delete
);

export default router; 
