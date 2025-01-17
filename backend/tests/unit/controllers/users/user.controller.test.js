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

    describe('updateProfile', () => {
        it('debería actualizar el perfil del usuario', async () => {
            mockReq.params.id = mockUser._id;
            mockReq.user._id = mockUser._id; // Usuario actualizando su propio perfil
            mockReq.body = {
                username: 'updateduser',
                email: 'updated@test.com'
            };
            mockUser.save.mockResolvedValue({
                ...mockUser,
                ...mockReq.body
            });

            await userController.updateProfile(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    username: 'updateduser',
                    email: 'updated@test.com'
                })
            );
        });

        it('debería impedir actualizar perfil de otro usuario', async () => {
            mockReq.params.id = new mongoose.Types.ObjectId(); // ID diferente
            mockReq.user._id = mockUser._id;
            mockReq.body = {
                username: 'updateduser'
            };

            await userController.updateProfile(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'No autorizado para actualizar este perfil'
            });
        });

        it('debería validar campos de actualización', async () => {
            mockReq.params.id = mockUser._id;
            mockReq.user._id = mockUser._id;
            mockReq.body = {
                username: '' // username vacío
            };

            await userController.updateProfile(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Nombre de usuario no puede estar vacío'
            });
        });
    });

    describe('changeRole', () => {
        it('debería cambiar el rol de un usuario', async () => {
            const adminUser = await User.create({
                username: 'adminuser',
                email: 'admin@test.com',
                password: 'Test1234!',
                role: 'admin'
            });

            mockReq.params.id = mockUser._id; // ID del usuario a cambiar
            mockReq.body = { role: 'moderator' };
            mockReq.user._id = adminUser._id; // Admin cambiando el rol

            await userController.changeRole(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    role: 'moderator'
                })
            );
        });

        it('debería impedir cambio de rol por usuario no autorizado', async () => {
            mockReq.params.id = mockUser._id; // ID del usuario a cambiar
            mockReq.body = { role: 'moderator' };
            mockReq.user._id = mockUser._id; // Usuario normal intentando cambiar su propio rol

            await userController.changeRole(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'No autorizado para cambiar el rol'
            });
        });

        it('debería validar rol permitido', async () => {
            const adminUser = await User.create({
                username: 'adminuser',
                email: 'admin@test.com',
                password: 'Test1234!',
                role: 'admin'
            });

            mockReq.params.id = mockUser._id; // ID del usuario a cambiar
            mockReq.body = { role: 'invalid_role' }; // Rol no válido
            mockReq.user._id = adminUser._id; // Admin cambiando el rol

            await userController.changeRole(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Rol no válido'
            });
        });
    });
}); 