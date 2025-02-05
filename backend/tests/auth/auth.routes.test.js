import request from 'supertest';
import { app } from '../../server.js';
import User from '../../users/models/User.js';

describe('Auth Routes', () => {
    let testUser;

    beforeAll(async () => {
        testUser = await User.create({
            username: 'testuser',
            email: 'test@test.com',
            password: 'password123'
        });
    });

    afterAll(async () => {
        await User.deleteMany({});
    });

    describe('POST /api/auth/login', () => {
        it('debería iniciar sesión con credenciales válidas', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@test.com',
                    password: 'password123'
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        it('debería denegar el inicio de sesión con credenciales inválidas', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@test.com',
                    password: 'wrongpassword'
                });

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('message', 'Credenciales inválidas');
        });
    });
});
