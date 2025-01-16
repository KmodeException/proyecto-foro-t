import mongoose from 'mongoose';
import ForumComment from '../../../models/ForumComment.js';
import ForumPost from '../../../models/ForumPost.js';
import User from '../../../models/User.js';

describe('ForumComment Model Test', () => {
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

    it('debería crear un comentario válido', async () => {
        // Arrange
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

        const validComment = {
            content: 'Test Comment',
            author: user._id,
            post: post._id
        };

        // Act
        const comment = new ForumComment(validComment);
        const savedComment = await comment.save();

        // Assert
        expect(savedComment._id).toBeDefined();
        expect(savedComment.content).toBe(validComment.content);
        expect(savedComment.author.toString()).toBe(user._id.toString());
        expect(savedComment.post.toString()).toBe(post._id.toString());
    });
});