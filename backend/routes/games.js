import express from 'express';
import { gameController } from '../controllers/games/gameController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleCheck } from '../middleware/roleCheck.js';

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
 */
router.get('/', gameController.getAll);

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
 */
router.get('/:id', gameController.getById);

// Rutas protegidas
router.post('/', 
    authMiddleware,
    roleCheck(['admin', 'translator']), 
    gameController.create
);

router.patch('/:id/status',
    authMiddleware,
    roleCheck(['admin', 'translator']),
    gameController.updateStatus
);

router.post('/:id/translators',
    authMiddleware,
    roleCheck(['admin', 'translator']),
    gameController.assignTranslator
);

export default router;
