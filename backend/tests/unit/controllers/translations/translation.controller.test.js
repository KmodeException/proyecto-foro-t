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

    describe('updateStatus', () => {
        it('debería actualizar el estado de una traducción', async () => {
            const moderator = await User.create({
                username: 'moderator',
                email: 'mod@test.com',
                password: 'Test1234!',
                role: 'moderator'
            });

            const translation = await Translation.create({
                content: 'Test Translation',
                game: new mongoose.Types.ObjectId(),
                translator: new mongoose.Types.ObjectId(),
                status: 'pending'
            });

            const req = {
                params: { id: translation._id },
                body: { status: 'approved' },
                user: { _id: moderator._id, role: 'moderator' }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await translationController.updateStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 'approved'
                })
            );
        });

        it('debería rechazar actualización por usuario no autorizado', async () => {
            const normalUser = await User.create({
                username: 'normaluser',
                email: 'user@test.com',
                password: 'Test1234!',
                role: 'user'
            });

            const translation = await Translation.create({
                content: 'Test Translation',
                game: new mongoose.Types.ObjectId(),
                translator: new mongoose.Types.ObjectId(),
                status: 'pending'
            });

            const req = {
                params: { id: translation._id },
                body: { status: 'approved' },
                user: { _id: normalUser._id, role: 'user' }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await translationController.updateStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: 'No autorizado para actualizar estados'
                })
            );
        });

        it('debería validar estados permitidos', async () => {
            const moderator = await User.create({
                username: 'moderator',
                email: 'mod@test.com',
                password: 'Test1234!',
                role: 'moderator'
            });

            const translation = await Translation.create({
                content: 'Test Translation',
                game: new mongoose.Types.ObjectId(),
                translator: new mongoose.Types.ObjectId(),
                status: 'pending'
            });

            const req = {
                params: { id: translation._id },
                body: { status: 'invalid_status' },
                user: { _id: moderator._id, role: 'moderator' }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await translationController.updateStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    message: expect.stringContaining('Estado no válido')
                })
            );
        });
    });

    describe('review', () => {
        it('debería permitir revisar una traducción con comentarios', async () => {
            const moderator = await User.create({
                username: 'moderator',
                email: 'mod@test.com',
                password: 'Test1234!',
                role: 'moderator'
            });

            const translation = await Translation.create({
                content: 'Test Translation',
                game: new mongoose.Types.ObjectId(),
                translator: new mongoose.Types.ObjectId(),
                status: 'pending'
            });

            const req = {
                params: { id: translation._id },
                body: {
                    status: 'approved',
                    reviewComments: 'Excelente traducción'
                },
                user: { _id: moderator._id, role: 'moderator' }
            };

            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };

            await translationController.review(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 'approved',
                    reviewComments: 'Excelente traducción',
                    reviewedBy: moderator._id
                })
            );
        });
    });
});