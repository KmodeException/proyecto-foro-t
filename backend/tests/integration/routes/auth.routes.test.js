import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../../server.js';
import User from '../../../models/User.js';

describe('Auth Routes', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/forum-test');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await User.deleteMany();
    });

    describe('POST /api/auth/register', () => {
        it('debería registrar un nuevo usuario', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'test@test.com',
                    password: 'Test1234!'
                });

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('message', 'Usuario registrado exitosamente');
        });
    });

    describe('POST /api/auth/login', () => {
        it('debería iniciar sesión exitosamente', async () => {
            // Crear usuario de prueba
            await User.create({
                username: 'testuser',
                email: 'test@test.com',
                password: 'Test1234!'
            });

            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@test.com',
                    password: 'Test1234!'
                });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('token');
            expect(res.body).toHaveProperty('message', 'Inicio de sesión exitoso');
        });

        it('debería rechazar credenciales inválidas', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'noexiste@test.com',
                    password: 'Test1234!'
                });

            expect(res.status).toBe(401);
            expect(res.body).toHaveProperty('message', 'Credenciales inválidas');
        });
    });
});