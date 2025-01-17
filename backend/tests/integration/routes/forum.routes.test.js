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

    describe('POST /api/forum/posts/:id/vote', () => {
        it('debería permitir dar upvote a un post', async () => {
            const post = await ForumPost.create({
                title: 'Test Post',
                content: 'Test Content',
                author: testUser._id,
                thread: new mongoose.Types.ObjectId(),
                votes: {
                    up: [],
                    down: []
                }
            });

            const res = await request(app)
                .post(`/api/forum/posts/${post._id}/upvote`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.votes.up).toContainEqual(testUser._id.toString());
            expect(res.body.votes.down).not.toContainEqual(testUser._id.toString());
        });

        it('debería permitir dar downvote a un post', async () => {
            const post = await ForumPost.create({
                title: 'Test Post',
                content: 'Test Content',
                author: testUser._id,
                thread: new mongoose.Types.ObjectId(),
                votes: {
                    up: [],
                    down: []
                }
            });

            const res = await request(app)
                .post(`/api/forum/posts/${post._id}/downvote`)
                .set('Authorization', `Bearer ${authToken}`);

            expect(res.status).toBe(200);
            expect(res.body.votes.down).toContainEqual(testUser._id.toString());
            expect(res.body.votes.up).not.toContainEqual(testUser._id.toString());
        });

        it('debería requerir autenticación para votar', async () => {
            const post = await ForumPost.create({
                title: 'Test Post',
                content: 'Test Content',
                author: testUser._id,
                thread: new mongoose.Types.ObjectId()
            });

            const res = await request(app)
                .post(`/api/forum/posts/${post._id}/upvote`);

            expect(res.status).toBe(401);
        });
    });
}); 