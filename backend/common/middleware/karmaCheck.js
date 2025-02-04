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
    return async (req, res, next) => {
        try {
            const restrictions = ReputationService.checkRestrictions(req.user.reputation);
            
            switch(action) {
                case 'createThread':
                    if (!restrictions.canCreateThreads) {
                        return res.status(403).json({ 
                            message: 'Karma insuficiente para crear hilos' 
                        });
                    }
                    break;
                case 'comment':
                    if (!restrictions.canComment) {
                        return res.status(403).json({ 
                            message: 'Karma insuficiente para comentar' 
                        });
                    }
                    break;
                case 'vote':
                    if (restrictions.readOnly) {
                        return res.status(403).json({ 
                            message: 'No puedes votar con karma negativo' 
                        });
                    }
                    break;
            }
            next();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
};
