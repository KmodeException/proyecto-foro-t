import { threadController } from '../../../../controllers/forum/threadController.js';
import Thread from '../../../../models/Thread.js';
import User from '../../../../models/User.js';
import mongoose from 'mongoose';

jest.mock('../../../../models/Thread.js');
jest.mock('../../../../models/User.js');

describe('Thread Controller Test', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/forum-test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await Thread.deleteMany();
        await User.deleteMany();
    });

    it('debería crear un nuevo hilo', async () => {
        const user = await User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'Test1234!'
        });

        const req = {
            body: {
                name: 'Test Thread',
                description: 'Test Description',
                type: 'general'
            },
            user: { _id: user._id }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await threadController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Test Thread',
                description: 'Test Description'
            })
        );
    });

    describe('getAll', () => {
        it('debería obtener todos los hilos', async () => {
            const req = {};
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await threadController.getAll(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Array));
        });
    });

    describe('getById', () => {
        it('debería obtener un hilo por ID', async () => {
            const user = await User.create({
                username: 'testuser',
                email: 'test@test.com',
                password: 'Test1234!'
            });

            const thread = await Thread.create({
                name: 'Test Thread',
                description: 'Test Description',
                creator: user._id
            });

            const req = {
                params: { id: thread._id }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await threadController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: 'Test Thread'
                })
            );
        });

        it('debería manejar hilo no encontrado', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();

            const req = {
                params: { id: nonExistentId }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await threadController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Hilo no encontrado'
                })
            );
        });
    });
}); 