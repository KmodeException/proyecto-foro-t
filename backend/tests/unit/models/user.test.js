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

    it('debería validar campos requeridos', async () => {
        const userSinCampos = new User({});

        try {
            await userSinCampos.save();
        } catch (error) {
            expect(error.errors.username).toBeDefined();
            expect(error.errors.email).toBeDefined();
            expect(error.errors.password).toBeDefined();
        }
    });

    it('debería validar email único', async () => {
        const primerUsuario = new User({
            username: 'test1',
            email: 'test@test.com',
            password: 'Password123!'
        });

        await primerUsuario.save();

        const segundoUsuario = new User({
            username: 'test2',
            email: 'test@test.com',
            password: 'Password123!'
        });

        try {
            await segundoUsuario.save();
        } catch (error) {
            expect(error.code).toBe(11000);
        }
    });
});