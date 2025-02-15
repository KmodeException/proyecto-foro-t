// backend/server.js

// dependencias
import express from 'express';
import cors from 'cors';
import passport from 'passport';
import dotenv from 'dotenv'; ;
import { fileURLToPath } from 'url';
import path from 'path';
import connectDB from './config/db.js';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import lusca from 'lusca';
// import swaggerSpec from './swaggerConfig.js';

// Rutas
import authRoutes from './auth/routes/auth.routes.js';
import gameRoutes from './games/routes/game.routes.js';
import translationRoutes from './translations/routes/translations.routes.js';

// Rutas foro
import threadRoutes from './forum/routes/thread.routes.js';
import forumPostRoutes from './forum/routes/post.routes.js';
import forumCommentRoutes from './forum/routes/comment.routes.js';
import userRoutes from './users/routes/user.routes.js';
import commentRoutes from './forum/routes/comment.routes.js';
import voteRoutes from './forum/routes/vote.routes.js';
import achievementRoutes from './users/routes/achievement.routes.js';
// import { load } from 'yamljs';

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
try {
    await connectDB();
} catch (error) {
    console.error('❌ Error fatal: No se pudo conectar a MongoDB');
    process.exit(1);
}

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
// Configuración de rutas
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/translations', translationRoutes);

// Rutas foro
app.use('/api/forum/threads', threadRoutes);
app.use('/api/forum/posts', forumPostRoutes);
app.use('/api/forum/comments', forumCommentRoutes);

// Rutas de usuarios
app.use('/api/users', userRoutes);

// Rutas adicionales
app.use('/api/comments', commentRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/achievements', achievementRoutes);

// Ruta para la documentación
app.get('/api-docs', (req, res) => {
    res.sendFile(path.join(__dirname, 'docs', 'apiDocs.html'));
});

// Redirigir la ruta raíz a la documentación
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Agregar antes de los manejadores de errores
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'API funcionando correctamente',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date(),
        uptime: process.uptime()
    });
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

// Configuración de la sesión
app.use(session({
    secret: process.env.SESSION_SECRET || 'tu_secreto',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/translation_db' }),
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 semana
        sameSite: 'strict',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
}));

// Middleware de seguridad Lusca
app.use(lusca({
    csrf: true,
    xframe: 'SAMEORIGIN',
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    xssProtection: true,
    nosniff: true,
    referrerPolicy: 'same-origin'
}));

// Ruta para obtener el token CSRF (si es necesario)
app.get('/api/csrf-token', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Exportar app para tests
export { app };

// Iniciar servidor solo si no estamos en test
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
        console.log(`📝 Documentación API en http://localhost:${PORT}/api-docs`);
        console.log(`🔋 Health check en http://localhost:${PORT}/health`);
        console.log(`⚙️  Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
}

export default app;

