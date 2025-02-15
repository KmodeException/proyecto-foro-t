import express from 'express';
import { forumPostController } from '../controllers/forumPostController.js';
import { authenticate } from '../../auth/middleware/authMiddleware.js';
import { postValidator } from '../validators/post.validator.js';
import { karmaCheck } from '../../common/middleware/karmaCheck.js';

const router = express.Router();

// Rutas base
router.post('/', 
    authenticate, 
    karmaCheck('createPost'),
    postValidator.create,
    forumPostController.create
);

router.put('/:id',
    authenticate,
    postValidator.update,
    forumPostController.update
);

router.get('/search', forumPostController.search);

export default router;
