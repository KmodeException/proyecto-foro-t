import { authMiddleware } from '../../../middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';
import User from '../../../models/User.js';
import mongoose from 'mongoose';

jest.mock('../../../models/User.js');

describe('Auth Middleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;
    let mockUser;

    beforeEach(() => {
        mockReq = {
            headers: {},
            user: null
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockNext = jest.fn();
        mockUser = {
            _id: new mongoose.Types.ObjectId(),
            username: 'testuser'
        };
    });

    it('debería autenticar con token válido', async () => {
        const token = jwt.sign({ id: mockUser._id }, process.env.JWT_SECRET || 'test_secret');
        mockReq.headers.authorization = `Bearer ${token}`;
        User.findById.mockResolvedValue(mockUser);

        await authMiddleware(mockReq, mockRes, mockNext);

        expect(mockReq.user).toEqual(mockUser);
        expect(mockNext).toHaveBeenCalled();
    });

    it('debería rechazar petición sin token', async () => {
        await authMiddleware(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Token no proporcionado'
        });
    });

    it('debería rechazar token inválido', async () => {
        mockReq.headers.authorization = 'Bearer invalid_token';

        await authMiddleware(mockReq, mockRes, mockNext);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: 'Token inválido'
        });
    });
}); 