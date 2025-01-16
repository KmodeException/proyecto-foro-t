/**
 * @swagger
 * /api/forum/threads:
 *   post:
 *     tags: [Forum]
 *     summary: Crear nuevo hilo
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [official, community]
 *     responses:
 *       201:
 *         description: Hilo creado exitosamente
 *       403:
 *         description: Karma insuficiente o no autorizado
 *   get:
 *     tags: [Forum]
 *     summary: Listar todos los hilos
 *     responses:
 *       200:
 *         description: Lista de hilos obtenida exitosamente
 */

import express from 'express';
import { threadController } from '../../controllers/forum/threadController.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { threadValidator } from '../../validators/forum/thread.validator.js';
import { karmaCheck } from '../../middleware/karmaCheck.js';

const router = express.Router();

router.post('/', 
    authenticate, 
    karmaCheck('createThread'),
    threadValidator.create,
    threadController.create
);

router.get('/', threadController.getAll);
router.get('/:id', threadController.getById);

// Rutas de gestión
router.patch('/:id', authenticate, threadController.update);
router.delete('/:id', authenticate, threadController.delete);

export default router;