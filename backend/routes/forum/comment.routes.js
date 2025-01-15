import express from 'express';
import { forumCommentController } from '../../controllers/forum/forumCommentController.js';
import { authenticate } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authenticate, forumCommentController.create);
router.get('/post/:postId', forumCommentController.getByPost);
router.post('/:id/vote', authenticate, forumCommentController.vote);

export default router;