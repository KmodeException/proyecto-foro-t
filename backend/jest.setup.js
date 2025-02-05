import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Cargar variables de entorno de test
dotenv.config({ path: '.env.test' });

// Aumentar timeout para tests lentos
jest.setTimeout(10000);

// Conectar a MongoDB antes de todos los tests
beforeAll(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI_TEST);
        console.log('✅ Connected to MongoDB Test Database');
    } catch (error) {
        console.error('❌ Error connecting to MongoDB Test Database:', error);
        process.exit(1);
    }
});

// Limpiar base de datos después de cada test
afterEach(async () => {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany();
    }
});

// Desconectar después de todos los tests
afterAll(async () => {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB Test Database');
});

// Limpiar mocks después de cada test
afterEach(() => {
    jest.clearAllMocks();
}); 