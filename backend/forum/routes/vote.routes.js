// backend/forum/routes/vote.routes.js
import express from 'express';
import { voteController } from '../controllers/voteController.js';
import { authenticate } from '../../auth/middleware/authMiddleware.js';
//import { voteValidator } from '../validators/vote.validator.js';
import { karmaCheck } from '../../common/middleware/karmaCheck.js';

const router = express.Router();

/**
 * @swagger
 * /api/votes:
 *   post:
 *     summary: Emitir un voto
 *     tags: [Votes]
 *     security:
 *       - BearerAuth: []
 */
router.post('/', 
    authenticate, 
    karmaCheck('vote'),
    voteController.create
);

export default router;