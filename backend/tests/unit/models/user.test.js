import mongoose from 'mongoose';
import User from '../../../models/User.js';

describe('User Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/forum-test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await User.deleteMany();
    });

    it('debería crear un usuario válido', async () => {
        const validUser = {
            username: 'testuser',
            email: 'test@test.com',
            password: 'Test1234!'
        };

        const user = new User(validUser);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe(validUser.username);
        expect(savedUser.email).toBe(validUser.email);
    });
});