import express from 'express';
import gameController from '../controllers/gameController.js';
import { authenticate, checkRole } from '../../auth/middleware/authMiddleware.js';
import { gameValidator } from '../validators/game.validator.js';

const router = express.Router();

router.get('/', gameController.getAll);

router.post('/', 
    authenticate, 
    checkRole(['admin', 'translator']),
    ...gameValidator.create, 
    gameController.create
);

router.get('/:id', gameController.getById);

router.put('/:id', 
    authenticate, 
    checkRole(['admin', 'translator']),
    gameValidator.update,
    gameController.update
);

router.delete('/:id', authenticate, checkRole(['admin', 'translator']), gameController.delete);

router.patch('/:id/status',
    authenticate,
    checkRole(['admin', 'translator']),
    ...gameValidator.updateStatus,
    gameController.updateStatus
);

router.post('/:id/translators',
    authenticate,
    checkRole(['admin', 'translator']),
    ...gameValidator.assignTranslator,
    gameController.assignTranslator
);

export default router; 