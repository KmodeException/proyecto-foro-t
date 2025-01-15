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

export default router;