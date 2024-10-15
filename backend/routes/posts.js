// routes/posts.js

import express from 'express';
import Post from 'backend/models/Post.js';
import User from 'backend/models/User.js';

const router = express.Router();

// Crear una nueva publicación
router.post('/', async (req, res) => {
  try {
    const { title, content, author, tags } = req.body;
    const user = await User.findById(author);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const newPost = new Post({ title, content, author, tags });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error al crear la publicación:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener todas las publicaciones
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'username email');
    res.status(200).json(posts);
  } catch (error) {
    console.error('Error al obtener las publicaciones:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;
