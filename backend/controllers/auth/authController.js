import User from '../../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * Controlador para manejar la autenticación de usuarios
 * @module controllers/auth/authController
 */
export const authController = {
    /**
     * Registra un nuevo usuario
     * @async
     * @param {Object} req.body - Datos del usuario
     * @param {string} req.body.username - Nombre de usuario
     * @param {string} req.body.email - Email del usuario
     * @param {string} req.body.password - Contraseña del usuario
     * @param {number} req.body.age - Edad del usuario
     */
    register: async (req, res, next) => {
        try {
            const { username, email, password, age } = req.body;

            // Verificar si el usuario ya existe
            const existingUser = await User.findOne({ 
                $or: [{ email }, { username }] 
            });

            if (existingUser) {
                return res.status(400).json({
                    error: 'Usuario ya existe',
                    details: 'El email o nombre de usuario ya está registrado'
                });
            }

            // Crear nuevo usuario
            const user = new User({
                username,
                email,
                password,
                age
            });

            await user.save();

            // Generar token
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.status(201).json({
                message: 'Usuario registrado exitosamente',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                token
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Inicia sesión de usuario
     * @async
     * @param {Object} req.body - Credenciales
     * @param {string} req.body.email - Email del usuario
     * @param {string} req.body.password - Contraseña del usuario
     */
    login: async (req, res, next) => {
        try {
            const { email, password } = req.body;

            // Buscar usuario
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({
                    error: 'Credenciales inválidas',
                    details: 'Email o contraseña incorrectos'
                });
            }

            // Verificar contraseña
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                return res.status(401).json({
                    error: 'Credenciales inválidas',
                    details: 'Email o contraseña incorrectos'
                });
            }

            // Generar token
            const token = jwt.sign(
                { id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({
                message: 'Inicio de sesión exitoso',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                token
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtiene el perfil del usuario actual
     * @async
     * @param {Object} req.user - Usuario autenticado
     */
    getProfile: async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id).select('-password');
            res.json(user);
        } catch (error) {
            next(error);
        }
    }
};
