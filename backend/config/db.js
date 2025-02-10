//backend/config/db.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno desde la raíz del proyecto
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const connectDB = async () => {
    try {
        // Si ya hay una conexión activa, retornar
        if (mongoose.connection.readyState === 1) {
            return;
        }

        const uri = process.env.NODE_ENV === 'test' 
            ? process.env.MONGODB_URI_TEST 
            : process.env.MONGO_URI; // Cambiado a MONGO_URI para coincidir con .env

        if (!uri) {
            throw new Error('MongoDB URI no está definida en las variables de entorno');
        }

        await mongoose.connect(uri);
        
        if (process.env.NODE_ENV !== 'test') {
            console.log('📦 MongoDB conectado en:', uri);
        }
    } catch (error) {
        console.error('❌ Error conectando a MongoDB:', error.message);
        if (process.env.NODE_ENV !== 'test') {
            process.exit(1);
        }
        throw error;
    }
};

export default connectDB;