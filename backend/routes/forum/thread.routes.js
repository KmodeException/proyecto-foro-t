import express from 'express';
import { threadController } from '../../controllers/forum/threadController.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, threadController.create);
router.get('/', threadController.getAll);

export default router;