import request from 'supertest';
import { app } from '../../server.js';
import User from '../../users/models/User.js';
import Game from '../../games/models/Game.js';

describe('Games Routes', () => {
    let authToken;
    let testUser;

    beforeAll(async () => {
        testUser = await User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'password123'
        });

        const loginRes = await request(app)
            .post('/api/auth/login')
            .send({
                email: 'test@test.com',
                password: 'password123'
            });

        authToken = loginRes.body.token;
    });

    afterAll(async () => {
        await User.deleteMany({});
        await Game.deleteMany({});
    });

    describe('POST /api/games', () => {
        it('debería crear un nuevo juego', async () => {
            const res = await request(app)
                .post('/api/games')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Test Game',
                    platform: 'PC'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('title', 'Test Game');
        });

        it('debería requerir autenticación para crear un juego', async () => {
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
