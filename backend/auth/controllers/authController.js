import User from '../../users/models/User.js';
import jwt from 'jsonwebtoken';

export const authController = {
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ 
                $or: [{ email }, { username }] 
            });
            
            if (existingUser) {
                return res.status(400).json({ 
                    message: 'El usuario o email ya está registrado' 
                });
            }

            // Crear nuevo usuario
            const user = new User({
                username,
                email,
                password
            });

            await user.save();

            // Generar token
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(201).json({ 
                message: 'Usuario registrado exitosamente',
                token
            });
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al registrar usuario',
                error: error.message 
            });
        }
    },

    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            // Buscar usuario
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Verificar contraseña
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            // Generar token
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ 
                message: 'Inicio de sesión exitoso',
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
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
            const user = await User.findById(req.user.id)
                .select('-password')
                .select('-__v');
                
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            res.json(user);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener perfil',
                error: error.message 
            });
        }
    }
};
