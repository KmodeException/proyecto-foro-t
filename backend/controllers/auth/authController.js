import User from '../../models/User.js';
import jwt from 'jsonwebtoken';

export const authController = {
    
    register: (req, res) => {
        // Lógica para registrar un usuario
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    },

    
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            // ...existing code...
            res.status(200).json({ 
                message: 'Inicio de sesión exitoso',
                token
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error en inicio de sesión',
                error: error.message 
            });
        }
    },

    
    getProfile: async (req, res) => {
        try {
            const user = await User.findById(req.user._id).select('-password');
            res.json(user);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener perfil',
                error: error.message 
            });
        }
    }
};
