import mongoose from 'mongoose';
import Thread from '../../../models/Thread.js';
import User from '../../../models/User.js';

describe('Thread Model Test', () => {
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

    it('debería crear un hilo válido', async () => {
        // Arrange
        const user = await User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'Test1234!'
        });

        const validThread = {
            name: 'Test Thread',
            description: 'Test Description',
            creator: user._id,
            type: 'community'
        };

        // Act
        const thread = new Thread(validThread);
        const savedThread = await thread.save();

        // Assert
        expect(savedThread._id).toBeDefined();
        expect(savedThread.name).toBe(validThread.name);
        expect(savedThread.creator.toString()).toBe(user._id.toString());
    });
});