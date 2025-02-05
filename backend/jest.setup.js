import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

// Configuración global para tests
jest.setTimeout(10000);

// Conectar a MongoDB de test
beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
});

// Limpiar base de datos después de cada test
afterEach(async () => {
    await Promise.all(
        Object.values(mongoose.connection.collections).map(async (collection) =>
            collection.deleteMany()
        )
    );
});

// Desconectar después de todos los tests
afterAll(async () => {
    await mongoose.disconnect();
});

// Limpiar todos los mocks después de cada test
afterEach(() => {
    jest.clearAllMocks();
}); 