import express from 'express';
import { forumPostController } from '../controllers/forumPostController.js';
import { authenticate, checkRole } from '../../auth/middleware/authMiddleware.js';
import { postValidator } from '../validators/post.validator.js';

const router = express.Router();

router.get('/', forumPostController.getAll);
router.get('/:id', forumPostController.getById);

router.post('/',
    authenticate,
    checkRole(['admin', 'moderator', 'user']),
    postValidator.create,
    forumPostController.create
);

router.put('/:id',
    authenticate,
    checkRole(['admin', 'moderator', 'user']),
    postValidator.update,
    forumPostController.update
);

router.delete('/:id',
    authenticate,
    checkRole(['admin', 'moderator', 'user']),
    forumPostController.delete
);

router.post('/:id/vote',
    authenticate,
    checkRole(['admin', 'moderator', 'user']),
    forumPostController.vote
);

export default router;
