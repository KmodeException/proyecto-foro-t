import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../server.js';
import User from '../../users/models/User.js';
import Game from '../../games/models/Game.js';
import Translation from '../../translations/models/Translation.js';

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

    describe('POST /api/translations/:id/review', () => {
        it('debería permitir revisar una traducción', async () => {
            const translation = await Translation.create({
                content: 'Test Translation',
                game: testGame._id,
                translator: testUser._id,
                language: 'es',
                status: 'pending'
            });

            const res = await request(app)
                .post(`/api/translations/${translation._id}/review`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    status: 'approved',
                    reviewComments: 'Excelente traducción'
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('status', 'approved');
            expect(res.body).toHaveProperty('reviewComments', 'Excelente traducción');
            expect(res.body).toHaveProperty('reviewedBy', testUser._id.toString());
        });

        it('debería validar estados de revisión válidos', async () => {
            const translation = await Translation.create({
                content: 'Test Translation',
                game: testGame._id,
                translator: testUser._id,
                language: 'es',
                status: 'pending'
            });

            const res = await request(app)
                .post(`/api/translations/${translation._id}/review`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    status: 'invalid_status',
                    reviewComments: 'Test review'
                });

            expect(res.status).toBe(400);
            expect(res.body).toHaveProperty('message', 'Estado de revisión inválido');
        });
    });
}); 
