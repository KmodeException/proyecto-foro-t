import express from 'express';
import { forumPostController } from '../../controllers/forum/forumPostController.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, forumPostController.create);
router.get('/thread/:threadId', forumPostController.getByThread);
router.post('/:id/vote', authenticate, forumPostController.vote);

export default router;