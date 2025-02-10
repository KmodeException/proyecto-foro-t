import request from 'supertest';
import { app } from '../../server.js';
import User from '../../users/models/User.js';
import ForumPost from '../../forum/models/ForumPost.js';

describe('Forum Routes', () => {
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
        await ForumPost.deleteMany({});
    });

    describe('POST /api/forum/posts', () => {
        it('debería crear un nuevo post', async () => {
            const res = await request(app)
                .post('/api/forum/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Test Post',
                    content: 'This is a test post.'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('title', 'Test Post');
        });

        it('debería requerir autenticación para crear un post', async () => {
            const res = await request(app)
                .post('/api/forum/posts')
                .send({
                    title: 'Test Post',
                    content: 'This is a test post.'
                });

            expect(res.status).toBe(401);
        });
    });
});
