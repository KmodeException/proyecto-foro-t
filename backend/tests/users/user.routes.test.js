import request from 'supertest';
import { app } from '../../server.js';
import User from '../../users/models/User.js';

describe('User Routes', () => {
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
    });

    describe('GET /api/users/:id', () => {
        it('debería obtener el perfil de usuario', async () => {
            const res = await request(app)
                .get(`/api/users/${testUser._id}`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('username', 'testuser');
        });

        it('debería devolver 404 si el usuario no existe', async () => {
            const res = await request(app)
                .get(`/api/users/invalidUserId`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(404);
        });
    });

    describe('PUT /api/users/:id', () => {
        it('debería actualizar el perfil de usuario', async () => {
            const res = await request(app)
                .put(`/api/users/${testUser._id}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ username: 'updatedUser' });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('username', 'updatedUser');
        });

        it('debería devolver 400 si el ID es inválido', async () => {
            const res = await request(app)
                .put(`/api/users/invalidUserId`)
                .set('Authorization', `Bearer ${authToken}`)
                .send({ username: 'updatedUser' });

            expect(res.status).toBe(400);
        });
    });
}); 