// backend/routes/posts.js
import express from 'express';
import Post from '../models/Post.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Obtener todas las publicaciones
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'username email')
            .sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error al obtener las publicaciones:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Crear una nueva publicación (protegida)
router.post('/', auth, async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const newPost = new Post({
            title,
            content,
            author: req.userId,
            tags
        });
        await newPost.save();
        await newPost.populate('author', 'username email');
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error al crear la publicación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Actualizar una publicación (protegida)
router.put('/:id', auth, async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ error: 'Publicación no encontrada' });
        }
        
        // Verificar que el usuario sea el autor
        if (post.author.toString() !== req.userId) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        post.title = title;
        post.content = content;
        post.tags = tags;
        
        await post.save();
        await post.populate('author', 'username email');
        res.json(post);
    } catch (error) {
        console.error('Error al actualizar la publicación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar una publicación (protegida)
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ error: 'Publicación no encontrada' });
        }
        
        // Verificar que el usuario sea el autor
        if (post.author.toString() !== req.userId) {
            return res.status(403).json({ error: 'No autorizado' });
        }

        await post.deleteOne();
        res.json({ message: 'Publicación eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar la publicación:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;