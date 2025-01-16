import { authController } from '../../../../controllers/auth/authController.js';
import User from '../../../../models/User.js';
import mongoose from 'mongoose';

describe('Auth Controller Test', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/forum-test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await User.deleteMany();
    });

    it('debería registrar un nuevo usuario', async () => {
        // Arrange
        const req = {
            body: {
                username: 'testuser',
                email: 'test@test.com',
                password: 'Test1234!'
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        // Act
        await authController.register(req, res);

        // Assert
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: 'Usuario registrado exitosamente'
            })
        );
    });

    it('debería validar campos requeridos en registro', async () => {
        const req = {
            body: {
                username: '',
                email: '',
                password: ''
            }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await authController.register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: expect.stringContaining('requeridos')
            })
        );
    });
});