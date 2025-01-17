import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../server.js';
import User from '../../../models/User.js';
import Game from '../../../models/Game.js';

describe('Games Routes', () => {
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
        await Game.deleteMany();
    });

    describe('POST /api/games', () => {
        it('debería crear un nuevo juego', async () => {
            const res = await request(app)
                .post('/api/games')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Test Game',
                    platform: 'PC',
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('title', 'Test Game');
            expect(res.body).toHaveProperty('translationLead', testUser._id.toString());
        });

        it('debería requerir autenticación', async () => {
            const res = await request(app)
                .post('/api/games')
                .send({
                    title: 'Test Game',
                    platform: 'PC'
                });

            expect(res.status).toBe(401);
        });
    });
}); 