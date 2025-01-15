import express from 'express';
import { forumPostController } from '../../controllers/forum/forumPostController.js';
import { authenticate } from '../../middleware/authMiddleware.js';
import { postValidator } from '../../validators/forum/post.validator.js';

const router = express.Router();

router.post('/', 
    authenticate, 
    postValidator.create,
    forumPostController.create
);
router.get('/thread/:threadId', forumPostController.getByThread);
router.post('/:id/vote',
    authenticate,
    postValidator.vote,
    forumPostController.vote
);

export default router;