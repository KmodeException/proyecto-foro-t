import User from '../../users/models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';
import { ReputationService } from '../../users/services/reputation.service.js';

dotenv.config();

const generateAccessToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

const authController = {
    refreshToken: async (req, res) => {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(401).json({ message: 'No refresh token' });
            }

            const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id);
            
            if (!user) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const accessToken = generateAccessToken(user);
            res.json({ accessToken });
        } catch (error) {
            res.status(401).json({ message: 'Invalid refresh token' });
        }
    },

    register: async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: 'User already exists' });
            }

            user = new User({ username, email, password });

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

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
            console.error('Error en inicio de sesión:', error);
            res.status(500).json({ 
                message: 'Error en inicio de sesión',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
            console.error('Error al obtener perfil:', error);
            res.status(500).json({ 
                message: 'Error al obtener perfil',
                error: error.message 
            });
        }
    },

    logout: async (req, res) => {
        try {
            if (req.user) {
                req.user.refreshToken = null;
                await req.user.save();
            }
            res.status(200).json({ message: 'Logout successful' });
        } catch (error) {
            res.status(500).json({ message: 'Error during logout', error: error.message });
        }
    }
};

export default authController;
