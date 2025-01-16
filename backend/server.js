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
import morgan from 'morgan';

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

// Logging
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :body'));

// Conectar a MongoDB
connectDB();

// Swagger configuration
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API Documentation for Forum & Translation System'
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
                description: 'Development server'
            }
        ]
    },
    apis: ['./routes/**/*.js', './models/*.js', './docs/**/*.yaml']
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

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API funcionando correctamente',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date(),
        uptime: process.uptime()
    });
});

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
    next();
});

// Manejar rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Ruta no encontrada'
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        status: 'error',
        message: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Export app
const startServer = () => {
    try {
        // Conectar DB
        connectDB();
        
        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
            console.log(`📝 Documentación API en http://localhost:${PORT}/api-docs`);
            console.log(`🔋 Health check en http://localhost:${PORT}/health`);
            console.log(`⚙️  Ambiente: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar servidor:', error);
        process.exit(1);
    }
};

// Manejo de señales de terminación
process.on('SIGTERM', () => {
    console.log('👋 Cerrando servidor...');
    process.exit(0);
});

export { app, startServer };
