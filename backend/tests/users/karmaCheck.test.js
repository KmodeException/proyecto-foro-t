import { karmaCheck } from '../../common/middleware/karmaCheck.js';
import User from '../../users/models/User.js';
import mongoose from 'mongoose';

describe('Karma Check Middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            user: {
                _id: new mongoose.Types.ObjectId(),
                karma: 0
            }
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
    });

    it('debería permitir acceso con karma suficiente', async () => {
        mockReq.user.karma = 100;
        
        await karmaCheck(50)(mockReq, mockRes, mockNext);
        
        expect(mockNext).toHaveBeenCalled();
        expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('debería denegar acceso con karma insuficiente', async () => {
        mockReq.user.karma = 25;
        
        await karmaCheck(50)(mockReq, mockRes, mockNext);
        
        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.stringContaining('karma')
            })
        );
    });

    it('debería manejar usuarios sin karma definido', async () => {
        delete mockReq.user.karma;
        
        await karmaCheck(50)(mockReq, mockRes, mockNext);
        
        expect(mockRes.status).toHaveBeenCalledWith(403);
    });
}); 
