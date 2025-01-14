import Comment from '../../models/Comment.js';
import User from '../../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: API de gestión de comentarios
 */
export const commentController = {
    /**
     * @swagger
     * /api/comments:
     *   post:
     *     summary: Crear un nuevo comentario
     *     tags: [Comments]
     *     security:
     *       - bearerAuth: []
     */
    create: async (req, res) => {
        try {
            const { content, postId } = req.body;
            const comment = await Comment.create({
                content,
                post: postId,
                author: req.user._id
            });
            
            await comment.populate('author', 'username');
            res.status(201).json(comment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    /**
     * @swagger
     * /api/comments/post/{postId}:
     *   get:
     *     summary: Obtener comentarios de un post
     */
    getByPost: async (req, res) => {
        try {
            const { postId } = req.params;
            const comments = await Comment.find({ post: postId })
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