import { ReputationService } from '../../users/services/reputation.service.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     KarmaError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         currentKarma:
 *           type: number
 *         restrictions:
 *           type: object
 *           properties:
 *             canCreateThreads:
 *               type: boolean
 *             canComment:
 *               type: boolean
 *             readOnly:
 *               type: boolean
 */

export const karmaCheck = (action) => {
    return (req, res, next) => {
        const restrictions = ReputationService.checkRestrictions(req.user.reputation);

        switch (action) {
            case 'createPost':
                if (restrictions.noPosts) {
                    return res.status(403).json({ message: 'No tienes suficiente karma para crear posts' });
                }
                break;
            case 'createComment':
                if (restrictions.noComments) {
                    return res.status(403).json({ message: 'No tienes suficiente karma para crear comentarios' });
                }
                break;
            default:
                return res.status(400).json({ message: 'Acción no válida' });
        }

        next();
    };
};
