import TranslationComment from '../models/TranslationComment.js';
import User from '../../users/models/User.js';
import jwt from 'jsonwebtoken';

export const translationCommentController = {
    create: async (req, res) => {
        try {
            const { content, translationId, type } = req.body;
            const comment = await TranslationComment.create({
                content,
                translation: translationId,
                author: req.user._id,
                type
            });
            
            await comment.populate('author', 'username');
            res.status(201).json(comment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getByTranslation: async (req, res) => {
        try {
            const { translationId } = req.params;
            const comments = await TranslationComment.find({ translation: translationId })
                .populate('author', 'username')
                .sort('-createdAt');
            res.json(comments);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
};

export const authController = {
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
