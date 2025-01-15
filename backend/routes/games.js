import express from 'express';
import { gameController } from '../controllers/games/gameController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { roleCheck } from '../middleware/roleCheck.js';
import { gameValidators } from '../validators/games.validators.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Games
 *   description: API para gestión de juegos y traducciones
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         platform:
 *           type: array
 *         status:
 *           type: string
 *         translationProgress:
 *           type: number
 */

/**
 * @swagger
 * /api/games:
 *   get:
 *     tags: [Games]
 *     summary: Obtener todos los juegos
 *     responses:
 *       200:
 *         description: Lista de juegos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Game'
 *   post:
 *     tags: [Games]
 *     summary: Crear nuevo juego
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
 *               platform:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Juego creado exitosamente
 */

/**
 * @swagger
 * /api/games/{id}:
 *   get:
 *     tags: [Games]
 *     summary: Obtener juego por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalles del juego
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Game'
 * 
 *   patch:
 *     tags: [Games]
 *     summary: Actualizar estado de traducción
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed]
 *               translationProgress:
 *                 type: number
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 */

router.get('/', gameController.getAll);
router.post('/', 
    authenticate, 
    roleCheck(['admin', 'translator']), 
    gameValidators.create, 
    gameController.create
);
router.get('/:id', gameController.getById);
router.patch('/:id/status',
    authenticate,
    roleCheck(['admin', 'translator']),
    gameValidators.updateStatus,
    gameController.updateStatus
);

export default router;
