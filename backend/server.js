// backend/server.js

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import open from 'open';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import postrouter from './routes/posts.js';
import helmet from 'helmet';
import morgan from 'morgan';
import { check, validationResult } from 'express-validator';
import passport from './config/passport.js'


//cargar variables de entorno
dotenv.config();

//conexión a la base de datos mongodb
const connectDB = async () => {
    try {
        mongoose.set('strictQuery', true)
        console.log('Conectando a la base de datos...');
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            
        });
        console.log('Conexión establecida con éxito a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1);
    }
};

//instancia de express
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(helmet());  // Añade el middleware de helmet para seguridad
app.use(morgan('tiny'));  // Añade el middleware de morgan para logging
app.use(express.json());  // Middleware para manejar solicitudes JSON
app.use(passport.initialize()); // Inicializa Passport

// middleware para autenticación
app.use(express.json());

//regustrar rutas de publicación
app.use('/api/posts', postrouter);

//registro de usuario
app.post('/registro', [
    check('nombre').not().isEmpty().withMessage('El nombre es requerido'), 
    check('email').isEmail().withMessage('Debe ser un correo válido'), 
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
     check('age').isInt({ min: 1 }).withMessage('La edad debe ser un número positivo')
], async (req, res) => {
    const errors = validationResult(req); if (!errors.isEmpty()) { return res.status(400).json({ errors: errors.array() }); 
    }
    
    try {
        const { nombre, email, password, age } = req.body;
        //verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'El usuario ya existe' });
        }
        //crear el usuario
        const newUser = new User({ username: nombre, email, password, age });
        await newUser.save();
        //crear token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h'});
        res.status(201).json({ token });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

//iniciar sesión
app.post('/login', async (req, res) => {
    try{
        const { email, password } = req.body;
        //verificar si el usuario existe
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }
        //verificar contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }
        //crear token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h'});
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }    
});

//rutas
app.get('/', (req, res) => {
    res.send('¡Bienvenido al foro de traducciones de videojuegos!');
});

//iniciar servidor
connectDB().then(() => {
    app.listen(port, async () => {
        console.log(`Servidor corriendo en el puerto ${port}`);
        await open(`http://localhost:${port}`);
    });
});
