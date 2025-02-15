import User from '../../users/models/User.js';
import jwt from 'jsonwebtoken';
import { ReputationService } from '../../users/services/reputation.service.js';
import bcrypt from 'bcrypt';

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
    );
};

export const authController = {
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body;

            const existingUser = await User.findOne({ 
                $or: [{ email }, { username }] 
            });
            
            if (existingUser) {
                return res.status(400).json({ 
                    message: existingUser.email === email ? 
                        'Email ya registrado' : 
                        'Nombre de usuario no disponible'
                });
            }

            const user = new User({
                username,
                email,
                password
            });

            await user.save();
            await ReputationService.initializeReputation(user._id);

            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            res.status(201).json({ 
                message: 'Usuario registrado exitosamente',
                accessToken,
                refreshToken,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({ 
                message: 'Error al registrar usuario',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

            // Generar tokens
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);

            // Guardar el refresh token en la base de datos (opcional, pero recomendado para invalidar tokens)
            user.refreshToken = refreshToken;
            await user.save();

            res.status(200).json({ 
                message: 'Inicio de sesión exitoso',
                accessToken,
                refreshToken,
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
    },

    refreshToken: async (req, res) => {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({ message: 'Refresh token requerido' });
        }

        try {
            // Verificar el refresh token
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

            // Buscar el usuario asociado al refresh token
            const user = await User.findById(decoded.id);

            if (!user || user.refreshToken !== refreshToken) {
                return res.status(401).json({ message: 'Refresh token inválido' });
            }

            // Generar un nuevo token de acceso
            const accessToken = generateAccessToken(user);

            res.status(200).json({ 
                message: 'Token refrescado exitosamente',
                accessToken
            });
        } catch (error) {
            console.error(error);
            res.status(403).json({ message: 'Refresh token inválido o expirado' });
        }
    },

    logout: async (req, res) => {
        try {
            req.user.refreshToken = null;
            await req.user.save();
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            res.status(500).json({ message: 'Error during logout', error: error.message });
        }
    }
};
