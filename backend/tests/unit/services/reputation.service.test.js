import { ReputationService } from '../../../services/reputation.service.js';
import User from '../../../models/User.js';
import mongoose from 'mongoose';

jest.mock('../../../models/User.js');

describe('Reputation Service', () => {
    let reputationService;
    let mockUser;

    beforeEach(() => {
        reputationService = new ReputationService();
        mockUser = {
            _id: new mongoose.Types.ObjectId(),
            karma: 0,
            save: jest.fn()
        };
        User.findById.mockResolvedValue(mockUser);
    });

    describe('updateKarma', () => {
        it('debería aumentar karma por traducción aprobada', async () => {
            await reputationService.updateKarma(mockUser._id, 'translation_approved');
            
            expect(mockUser.karma).toBe(10);
            expect(mockUser.save).toHaveBeenCalled();
        });

        it('debería aumentar karma por voto positivo', async () => {
            await reputationService.updateKarma(mockUser._id, 'post_upvoted');
            
            expect(mockUser.karma).toBe(5);
            expect(mockUser.save).toHaveBeenCalled();
        });

        it('debería reducir karma por voto negativo', async () => {
            await reputationService.updateKarma(mockUser._id, 'post_downvoted');
            
            expect(mockUser.karma).toBe(-2);
            expect(mockUser.save).toHaveBeenCalled();
        });

        it('debería manejar tipos de karma inválidos', async () => {
            await expect(
                reputationService.updateKarma(mockUser._id, 'invalid_type')
            ).rejects.toThrow('Tipo de karma inválido');
        });
    });
}); 