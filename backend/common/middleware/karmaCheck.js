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
        if (!req.user || !req.user.reputation) {
            return res.status(401).json({ message: 'Usuario no autenticado o sin reputación.' });
        }

        const restrictions = ReputationService.checkRestrictions(req.user.reputation);

         if (action === 'createThread' && restrictions.noPosts) {
            return res.status(403).json({ message: 'No tienes suficiente karma para crear hilos.' });
        }


        next();
    };
};
