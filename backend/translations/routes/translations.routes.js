import express from 'express';
import { translationController } from '../controllers/translationController.js';
import { authenticate, checkRole } from '../../auth/middleware/authMiddleware.js';
import { translationValidators } from '../validators/translations.validators.js';
import { karmaCheck } from '../../common/middleware/karmaCheck.js';

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
    karmaCheck('createTranslation'),
    translationValidators.create,
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
    translationValidators.update,
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
    translationValidators.review,
    translationController.review
);

/**
 * @swagger
 * /api/translations/game/{gameId}:
 *   get:
 *     tags: [Translations]
 *     summary: Obtener traducciones por juego
 */
router.get('/game/:gameId', 
    authenticate, 
    translationController.getByGame
);

router.get('/:id', translationController.getById);
router.patch('/:id/review', 
    authenticate, 
    checkRole(['admin']),
    translationValidators.review,
    translationController.approveTranslation
);
router.patch('/:id/reject', 
    authenticate, 
    checkRole(['admin']),
    translationValidators.review,
    translationController.rejectTranslation
);

export default router;
