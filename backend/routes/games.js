import express from 'express';
import { gameController } from '../controllers/games/gameController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { roleCheck } from '../middleware/roleCheck.js';

const router = express.Router();

// Rutas públicas
router.get('/', gameController.getAll);
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