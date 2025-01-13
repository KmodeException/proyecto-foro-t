// backend/server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from './config/passport.js';
import connectDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Rutas
import postRoutes from './routes/posts.js';
import authRoutes from './routes/auth.js';
import subsectionRoutes from './routes/subsections.js';

// Configuración
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Conectar a MongoDB
connectDB();

// Rutas
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subsections', subsectionRoutes);

// Ruta para la documentación
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'apiDocs.html'));
});

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
    console.log(`�� Servidor corriendo en puerto ${PORT}`);
});

export default app;
