import express from 'express';
import { translationController } from '../controllers/translations/translationController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { roleCheck } from '../middleware/roleCheck.js';

/**
 * @swagger
 * tags:
 *   name: Translations
 *   description: API para gestión de traducciones
 */

const router = express.Router();

/**
 * @swagger
 * /api/translations:
 *   post:
 *     tags: [Translations]
 *     summary: Crear nueva traducción
 *     security:
 *       - BearerAuth: []
 */
router.post('/', 
    authenticate, 
    roleCheck(['translator', 'admin']), 
    translationController.create
);

/**
 * @swagger
 * /api/translations/{id}:
 *   put:
 *     tags: [Translations]
 *     summary: Actualizar traducción existente
 */
router.put('/:id', 
    authenticate, 
    roleCheck(['translator', 'admin']), 
    translationController.update
);

/**
 * @swagger
 * /api/translations/{id}/review:
 *   patch:
 *     tags: [Translations]
 *     summary: Revisar traducción
 */
router.patch('/:id/review', 
    authenticate, 
    roleCheck(['admin']), 
    translationController.review
);

/**
 * @swagger
 * /api/translations/game/{gameId}:
 *   get:
 *     tags: [Translations]
 *     summary: Obtener traducciones por juego
 */
router.get('/game/:gameId', translationController.getByGame);

export default router;