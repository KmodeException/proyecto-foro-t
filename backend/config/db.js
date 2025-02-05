//backend/config/db.js

import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Si ya hay una conexión activa, retornar
        if (mongoose.connection.readyState === 1) {
            return;
        }

        const uri = process.env.NODE_ENV === 'test' 
            ? process.env.MONGODB_URI_TEST 
            : process.env.MONGODB_URI;

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        if (process.env.NODE_ENV !== 'test') {
            console.log('📦 MongoDB conectado');
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