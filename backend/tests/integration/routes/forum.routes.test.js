import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../server.js';
import User from '../../../models/User.js';
import ForumPost from '../../../models/ForumPost.js';
import Thread from '../../../models/Thread.js';

describe('Forum Routes', () => {
    let authToken;
    let testUser;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/forum-test');
        
        // Crear usuario y obtener token
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
        await Thread.deleteMany();
    });

    describe('POST /api/forum/posts', () => {
        it('debería crear un nuevo post', async () => {
            const thread = await Thread.create({
                name: 'Test Thread',
                description: 'Test Description',
                creator: testUser._id
            });

            const res = await request(app)
                .post('/api/forum/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send({
                    title: 'Test Post',
                    content: 'Test Content',
                    threadId: thread._id
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('title', 'Test Post');
            expect(res.body).toHaveProperty('author', testUser._id.toString());
        });

        it('debería requerir autenticación', async () => {
            const res = await request(app)
                .post('/api/forum/posts')
                .send({
                    title: 'Test Post',
                    content: 'Test Content'
                });

            expect(res.status).toBe(401);
        });
    });
}); 