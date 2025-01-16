import { translationController } from '../../../../controllers/translations/translationController.js';
import Translation from '../../../../models/Translation.js';
import User from '../../../../models/User.js';
import Game from '../../../../models/Game.js';
import mongoose from 'mongoose';

describe('Translation Controller Test', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/forum-test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await Translation.deleteMany();
        await User.deleteMany();
        await Game.deleteMany();
    });

    it('debería crear una traducción', async () => {
        const user = await User.create({
            username: 'translator',
            email: 'translator@test.com',
            password: 'Test1234!'
        });

        const game = await Game.create({
            title: 'Test Game',
            description: 'Test Description'
        });

        const req = {
            body: {
                content: 'Test Translation',
                gameId: game._id
            },
            user: { _id: user._id }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await translationController.create(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                content: 'Test Translation',
                status: 'pending'
            })
        );
    });
});