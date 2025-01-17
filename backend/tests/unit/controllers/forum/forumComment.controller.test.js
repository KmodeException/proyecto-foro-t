import { forumCommentController } from '../../../../controllers/forum/forumCommentController.js';
import ForumComment from '../../../../models/ForumComment.js';
import ForumPost from '../../../../models/ForumPost.js';
import User from '../../../../models/User.js';
import mongoose from 'mongoose';

jest.mock('../../../../models/ForumComment.js');
jest.mock('../../../../models/ForumPost.js');
jest.mock('../../../../models/User.js');

describe('Forum Comment Controller Test', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/forum-test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await ForumComment.deleteMany();
        await ForumPost.deleteMany();
        await User.deleteMany();
    });

    it('debería crear un comentario', async () => {
        const user = await User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'Test1234!'
        });

        const post = await ForumPost.create({
            title: 'Test Post',
            content: 'Test Content',
            author: user._id
        });

        const req = {
            body: {
                content: 'Test Comment',
                postId: post._id
            },
            user: { _id: user._id }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await forumCommentController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                content: 'Test Comment',
                post: post._id
            })
        );
    });

    describe('getByPost', () => {
        it('debería obtener comentarios de un post', async () => {
            const user = await User.create({
                username: 'testuser',
                email: 'test@test.com',
                password: 'Test1234!'
            });

            const post = await ForumPost.create({
                title: 'Test Post',
                content: 'Test Content',
                author: user._id
            });

            await ForumComment.create({
                content: 'Test Comment',
                post: post._id,
                author: user._id
            });

            const req = {
                params: { postId: post._id }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await forumCommentController.getByPost(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.any(Array));
        });
    });
}); 