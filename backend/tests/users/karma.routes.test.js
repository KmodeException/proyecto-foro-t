import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../server.js';
import User from '../../users/models/User.js';
import ForumPost from '../../forum/models/ForumPost.js';
import Translation from '../../../models/Translation.js';

describe('Karma Routes', () => {
    let authToken;
    let testUser;

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
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await ForumPost.deleteMany();
        await Translation.deleteMany();
    });

    describe('GET /api/karma/:userId', () => {
        it('debería obtener el karma del usuario', async () => {
            const res = await request(app)
                .get(`/api/karma/${testUser._id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('karma');
            expect(res.body).toHaveProperty('level');
        });

        it('debería mostrar historial de karma', async () => {
            const res = await request(app)
                .get(`/api/karma/${testUser._id}/history`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('history');
            expect(Array.isArray(res.body.history)).toBe(true);
        });
    });

    describe('POST /api/karma/:userId/update', () => {
        it('debería actualizar karma por traducción aprobada', async () => {
            const translation = await Translation.create({
                content: 'Test Translation',
                translator: testUser._id,
                status: 'approved'
            });

            const res = await request(app)
                .post(`/api/karma/${testUser._id}/update`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    type: 'translation_approved',
                    referenceId: translation._id
                });

            expect(res.status).toBe(200);
            expect(res.body.karma).toBeGreaterThan(0);
            expect(res.body).toHaveProperty('message', 'Karma actualizado correctamente');
        });

        it('debería actualizar karma por post votado positivamente', async () => {
            const post = await ForumPost.create({
                title: 'Test Post',
                content: 'Test Content',
                author: testUser._id
            });

            const res = await request(app)
                .post(`/api/karma/${testUser._id}/update`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    type: 'post_upvoted',
                    referenceId: post._id
                });

            expect(res.status).toBe(200);
            expect(res.body.karma).toBeGreaterThan(0);
        });

        it('debería requerir autenticación', async () => {
            const res = await request(app)
                .post(`/api/karma/${testUser._id}/update`)
                .send({
                    type: 'translation_approved',
                    referenceId: new mongoose.Types.ObjectId()
                });

            expect(res.status).toBe(401);
        });
    });
}); 
