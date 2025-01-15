// backend/server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from './config/passport.js';
import connectDB from './config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Importar rutas del foro
import threadRoutes from './routes/forum/thread.routes.js';
import forumPostRoutes from './routes/forum/post.routes.js';
import forumCommentRoutes from './routes/forum/comment.routes.js';

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

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Documentación de la API',
      version: '1.0.0',
      description: 'API para gestionar subapartados y posts.',
    },
    servers: [
      {
        url: 'http://localhost:3000/api-docs',
      },
    ],
  },
  apis: ['./routes/*.js'], // Ruta a tus archivos de rutas
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Servir archivos estáticos desde la carpeta 'docs'
app.use(express.static(path.join(__dirname, 'docs')));

// Rutas existentes
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/subsections', subsectionRoutes);

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

export default app;
