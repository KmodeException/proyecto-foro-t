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

    describe('getByGame', () => {
        it('debería obtener traducciones por juego', async () => {
            const user = await User.create({
                username: 'translator',
                email: 'translator@test.com',
                password: 'Test1234!'
            });

            const game = await Game.create({
                title: 'Test Game',
                description: 'Test Description'
            });

            await Translation.create({
                content: 'Translation 1',
                game: game._id,
                translator: user._id,
                status: 'pending'
            });

            const req = {
                params: { gameId: game._id }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await translationController.getByGame(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.arrayContaining([
                    expect.objectContaining({
                        content: 'Translation 1'
                    })
                ])
            );
        });
    });

    describe('getById', () => {
        it('debería obtener una traducción por ID', async () => {
            const user = await User.create({
                username: 'translator',
                email: 'translator@test.com',
                password: 'Test1234!'
            });

            const game = await Game.create({
                title: 'Test Game',
                description: 'Test Description'
            });

            const translation = await Translation.create({
                content: 'Test Translation',
                game: game._id,
                translator: user._id,
                status: 'pending'
            });

            const req = {
                params: { id: translation._id }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await translationController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    content: 'Test Translation',
                    status: 'pending'
                })
            );
        });

        it('debería manejar traducción no encontrada', async () => {
            const nonExistentId = new mongoose.Types.ObjectId();
            
            const req = {
                params: { id: nonExistentId }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await translationController.getById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'Traducción no encontrada'
                })
            );
        });
    });
});