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
});