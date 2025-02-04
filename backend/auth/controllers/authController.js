import User from '../../users/models/User.js';
import jwt from 'jsonwebtoken';

export const authController = {
    
    register: (req, res) => {
        // Lógica para registrar un usuario
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    },

    
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Lógica para autenticar al usuario
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Verificar la contraseña
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Generar el token JWT
            const token = jwt.sign(
                { id: user._id, role: user.role }, // Payload
                process.env.JWT_SECRET, // Clave secreta para firmar el token
                { expiresIn: '1h' } // Tiempo de expiración
            );

            // Devolver el token al cliente
            res.status(200).json({ 
                message: 'Inicio de sesión exitoso',
                token // Devuelve el token al cliente
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
