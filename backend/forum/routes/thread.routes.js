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
 *             $ref: '#/components/schemas/Thread'
 *     responses:
 *       201:
 *         description: Hilo creado exitosamente
 *       403:
 *         description: Karma insuficiente o no autorizado
 * 
 *   get:
 *     tags: [Forum]
 *     summary: Listar todos los hilos
 *     responses:
 *       200:
 *         description: Lista de hilos obtenida exitosamente
 * 
 * /api/forum/threads/{id}:
 *   patch:
 *     tags: [Forum]
 *     summary: Actualizar hilo
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hilo actualizado
 *       403:
 *         description: No autorizado
 * 
 *   delete:
 *     tags: [Forum]
 *     summary: Eliminar hilo
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hilo eliminado
 *       403:
 *         description: No autorizado
 */

import express from 'express';
import { threadController } from '../controllers/threadController.js';
import { authenticate, checkRole } from '../../auth/middleware/authMiddleware.js';
import { threadValidator } from '../validators/thread.validator.js';
import { karmaCheck } from '../../common/middleware/karmaCheck.js';
const router = express.Router();

router.get('/', threadController.getAll);

router.post(
    '/',
    authenticate,
    checkRole(['admin', 'moderator', 'user']),
    karmaCheck('createThread'),
    ...threadValidator.create,
    (req, res) => threadController.create(req, res)
);

router.get('/:id', threadController.getById);

router.put('/:id',
    authenticate,
    checkRole(['admin', 'moderator', 'user']),
    threadValidator.update,
    threadController.update
);

router.delete('/:id', 
    authenticate, 
    checkRole(['admin', 'moderator', 'user']),
    threadController.delete
);

router.get('/search', threadController.search);

export default router;
