import mongoose from 'mongoose';
import User from '../../../models/User.js';

describe('User Model Test', () => {
    beforeAll(async () => {
        await mongoose.connect(global.__MONGO_URI__);
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    it('should validate a correct user model', async () => {
        const validUser = {
            username: 'testUser',
            email: 'test@example.com',
            password: 'Password123!'
        };

        const user = new User(validUser);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.username).toBe(validUser.username);
        expect(savedUser.email).toBe(validUser.email);
    });
});