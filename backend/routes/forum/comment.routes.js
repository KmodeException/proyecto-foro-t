import express from 'express';
import { forumCommentController } from '../../controllers/forum/forumCommentController.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { commentValidator } from '../../validators/forum/comment.validator.js';

const router = express.Router();

router.post('/',
    authenticate,
    commentValidator.create,
    forumCommentController.create
);
router.get('/post/:postId', forumCommentController.getByPost);
router.post('/:id/vote', authenticate, forumCommentController.vote);

export default router;