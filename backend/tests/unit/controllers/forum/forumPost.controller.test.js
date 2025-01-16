import { forumPostController } from '../../../../controllers/forum/forumPostController.js';
import ForumPost from '../../../../models/ForumPost.js';
import Thread from '../../../../models/Thread.js';
import User from '../../../../models/User.js';
import mongoose from 'mongoose';

describe('Forum Post Controller Test', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/forum-test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await ForumPost.deleteMany();
        await Thread.deleteMany();
        await User.deleteMany();
    });

    it('debería crear un post', async () => {
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
            body: {
                title: 'Test Post',
                content: 'Test Content',
                threadId: thread._id
            },
            user: { _id: user._id }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await forumPostController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                title: 'Test Post',
                content: 'Test Content'
            })
        );
    });

    describe('getById', () => {
        it('debería obtener un post por ID', async () => {
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

            const post = await ForumPost.create({
                title: 'Test Post',
                content: 'Test Content',
                author: user._id,
                thread: thread._id
            });

            const req = {
                params: { id: post._id }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await forumPostController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Test Post'
                })
            );
        });

        it('debería manejar post no encontrado', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            
            const req = {
                params: { id: nonExistentId }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await forumPostController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Post no encontrado'
                })
            );
        });
    });

    describe('update', () => {
        it('debería actualizar un post existente', async () => {
            const user = await User.create({
                username: 'testuser',
                email: 'test@test.com',
                password: 'Test1234!'
            });

            const post = await ForumPost.create({
                title: 'Original Title',
                content: 'Original Content',
                author: user._id
            });

            const req = {
                params: { id: post._id },
                body: {
                    title: 'Updated Title',
                    content: 'Updated Content'
                },
                user: { _id: user._id }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await forumPostController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    title: 'Updated Title',
                    content: 'Updated Content'
                })
            );
        });

        it('debería impedir actualización por usuario no autorizado', async () => {
            const originalUser = await User.create({
                username: 'originaluser',
                email: 'original@test.com',
                password: 'Test1234!'
            });

            const otherUser = await User.create({
                username: 'otheruser',
                email: 'other@test.com',
                password: 'Test1234!'
            });

            const post = await ForumPost.create({
                title: 'Original Title',
                content: 'Original Content',
                author: originalUser._id
            });

            const req = {
                params: { id: post._id },
                body: {
                    title: 'Updated Title',
                    content: 'Updated Content'
                },
                user: { _id: otherUser._id }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await forumPostController.update(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining('No autorizado')
                })
            );
        });
    });
});