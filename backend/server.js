// backend/server.js

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import open from 'open';

//cargar variables de entorno
dotenv.config();

//conexión a la base de datos mongodb
const connectDB = async () => {
    try {
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

//rutas
app.get('/', (req, res) => {
    res.send('¡Bienvenido al foro de traducciones de videojuegos!');
});

//iniciar servidor
app.listen(port, async () => {
    console.log(`Servidor corriendo en el puerto ${port}`);
    await open(`http://localhost:${port}`);
    await connectDB(); //conectar a la base de datos
});
