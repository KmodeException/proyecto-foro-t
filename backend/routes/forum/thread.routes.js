import express from 'express';
import { threadController } from '../../controllers/forum/threadController.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { threadValidator } from '../../validators/forum/thread.validator.js';

const router = express.Router();

router.post('/', 
    authenticate, 
    threadValidator.create,
    threadController.create
);
router.get('/', threadController.getAll);

export default router;