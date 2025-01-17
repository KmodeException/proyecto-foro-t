import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../server.js';
import User from '../../../models/User.js';
import ForumPost from '../../../models/ForumPost.js';
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
}); 