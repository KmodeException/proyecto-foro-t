import mongoose from 'mongoose';
import Translation from '../../../models/Translation.js';
import User from '../../../models/User.js';
import Game from '../../../models/Game.js';

describe('Translation Model Test', () => {
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

    it('debería crear una traducción válida', async () => {
        // Arrange
        const user = await User.create({
            username: 'translator',
            email: 'translator@test.com',
            password: 'Test1234!'
        });

        const game = await Game.create({
            title: 'Test Game',
            description: 'Test Description'
        });

        const validTranslation = {
            content: 'Traducción de prueba',
            game: game._id,
            translator: user._id,
            language: 'es',
            status: 'pending'
        };

        // Act
        const translation = new Translation(validTranslation);
        const savedTranslation = await translation.save();

        // Assert
        expect(savedTranslation._id).toBeDefined();
        expect(savedTranslation.content).toBe(validTranslation.content);
        expect(savedTranslation.translator.toString()).toBe(user._id.toString());
        expect(savedTranslation.game.toString()).toBe(game._id.toString());
    });
});