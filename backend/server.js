// backend/server.js

import express from 'express';
import cors from 'cors';
import passport from 'passport';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import connectDB from './config/db.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Rutas
import authRoutes from './routes/auth.js';
import gamesRoutes from './routes/games.js';
import translationRoutes from './routes/translations.js';

// Rutas foro
import threadRoutes from './routes/forum/thread.routes.js';
import forumPostRoutes from './routes/forum/post.routes.js';
import forumCommentRoutes from './routes/forum/comment.routes.js';

// Configuración
dotenv.config();
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// Conectar a MongoDB
connectDB();

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Documentación API Foro y Traducciones'
        },
        servers: [
            {
                url: `http://localhost:${PORT}`
            }
        ]
    },
    apis: ['./routes/**/*.js', './models/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Servir archivos estáticos desde la carpeta 'docs'
app.use(express.static(path.join(__dirname, 'docs')));

// Rutas existentes
app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/translations', translationRoutes);

// Rutas del foro
app.use('/api/forum/threads', threadRoutes);
app.use('/api/forum/posts', forumPostRoutes);
app.use('/api/forum/comments', forumCommentRoutes);

// Ruta para la documentación
app.get('/api-docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'apiDocs.html'));
});

// Redirigir la ruta raíz a la documentación
app.get('/', (req, res) => {
    res.redirect('/api-docs');
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
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
    console.log(`📝 Documentación en http://localhost:${PORT}/api-docs`);
});

export default app;
