import express from 'express';
import { forumPostController } from '../controllers/forumPostController.js';
import { authenticate, checkRole } from '../../auth/middleware/authMiddleware.js';
import { postValidators } from '../validators/post.validators.js';

const router = express.Router();

router.get('/', forumPostController.getAll);
router.get('/:id', forumPostController.getById);

router.post('/',
    authenticate,
    checkRole(['admin', 'moderator', 'user']),
    postValidators.create,
    forumPostController.create
);

router.put('/:id',
    authenticate,
    checkRole(['admin', 'moderator', 'user']),
    postValidators.update,
    forumPostController.update
);

router.delete('/:id',
    authenticate,
    checkRole(['admin', 'moderator', 'user']),
    forumPostController.delete
);

export default router;
