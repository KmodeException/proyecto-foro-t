import mongoose from 'mongoose';
import ForumPost from '../../../models/ForumPost.js';
import Thread from '../../../models/Thread.js';
import User from '../../../models/User.js';

describe('ForumPost Model Test', () => {
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

    it('debería crear un post válido', async () => {
        // Arrange
        const user = await User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'Test1234!'
        });

        const thread = await Thread.create({
            name: 'Test Thread',
            description: 'Test Description',
            creator: user._id,
            type: 'community'
        });

        const validPost = {
            title: 'Test Post',
            content: 'Test Content',
            author: user._id,
            thread: thread._id
        };

        // Act
        const post = new ForumPost(validPost);
        const savedPost = await post.save();

        // Assert
        expect(savedPost._id).toBeDefined();
        expect(savedPost.title).toBe(validPost.title);
        expect(savedPost.author.toString()).toBe(user._id.toString());
        expect(savedPost.thread.toString()).toBe(thread._id.toString());
    });
});