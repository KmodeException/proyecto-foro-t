import express from 'express';
import { translationController } from '../controllers/translations/translationController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { checkRole } from '../middleware/authMiddleware.js';

/**
 * @swagger
 * tags:
 *   name: Translations
 *   description: API para gestionar traducciones
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
    checkRole(['translator', 'admin']), 
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
    checkRole(['translator', 'admin']), 
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
    checkRole(['admin']), 
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

router.get('/:id', translationController.getById);
router.patch('/:id/approve', authenticate, checkRole(['admin']), translationController.approveTranslation);
router.patch('/:id/reject', authenticate, checkRole(['admin']), translationController.rejectTranslation);

export default router;