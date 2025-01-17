import { userController } from '../../../../controllers/users/userController.js';
import User from '../../../../models/User.js';
import mongoose from 'mongoose';

jest.mock('../../../../models/User.js');

describe('User Controller', () => {
    let mockReq;
    let mockRes;
    let mockUser;

    beforeEach(() => {
        mockReq = {
            user: {
                _id: new mongoose.Types.ObjectId()
            },
            body: {},
            params: {}
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockUser = {
            _id: new mongoose.Types.ObjectId(),
            username: 'testuser',
            email: 'test@test.com',
            karma: 100,
            role: 'user',
            save: jest.fn()
        };
        User.findById.mockResolvedValue(mockUser);
    });

    describe('getProfile', () => {
        it('debería obtener el perfil del usuario', async () => {
            mockReq.params.id = mockUser._id;

            await userController.getProfile(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    username: 'testuser',
                    karma: 100
                })
            );
        });

        it('debería manejar usuario no encontrado', async () => {
            User.findById.mockResolvedValue(null);
            mockReq.params.id = new mongoose.Types.ObjectId();

            await userController.getProfile(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Usuario no encontrado'
            });
        });
    });
}); 