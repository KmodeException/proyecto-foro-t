// backend/server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from './config/passport.js';
import connectDB from './config/db.js';
import rateLimit from 'express-rate-limit';

// Rutas
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';
import subsectionRoutes from './routes/subsections.js';

// Configuración
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Configuración de rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Limite de 100 solicitudes por IP
    message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo después de 15 minutos'
});

app.use(limiter);

// Conectar a MongoDB
connectDB();

// Rutas
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subsections', subsectionRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});

export default app;
