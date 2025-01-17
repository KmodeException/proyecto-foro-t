import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../server.js';
import User from '../../../models/User.js';
import Game from '../../../models/Game.js';
import Translation from '../../../models/Translation.js';

describe('Translation Routes', () => {
    let authToken;
    let testUser;
    let testGame;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/forum-test');
        
        testUser = await User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'Test1234!'
        });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@test.com',
                password: 'Test1234!'
            });

        authToken = loginRes.body.token;

        testGame = await Game.create({
            title: 'Test Game',
            platform: 'PC',
            translationLead: testUser._id
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await Translation.deleteMany();
    });

    describe('POST /api/translations', () => {
        it('debería crear una nueva traducción', async () => {
            const res = await request(app)
                .post('/api/translations')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    content: 'Test Translation',
                    game: testGame._id,
                    language: 'es'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('content', 'Test Translation');
            expect(res.body).toHaveProperty('translator', testUser._id.toString());
            expect(res.body).toHaveProperty('status', 'pending');
        });

        it('debería requerir autenticación', async () => {
            const res = await request(app)
                .post('/api/translations')
                .send({
                    content: 'Test Translation',
                    game: testGame._id,
                    language: 'es'
                });

            expect(res.status).toBe(401);
        });
    });
}); 