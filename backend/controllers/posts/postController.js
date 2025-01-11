import Post from '../../models/Post.js';

/**
 * Controlador para manejar operaciones relacionadas con posts
 * @module controllers/posts/postController
 */
export const postController = {
    /**
     * Obtiene todas las publicaciones
     * @async
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next middleware function
     */
    getAllPosts: async (req, res, next) => {
        try {
            const { page = 1, limit = 10 } = req.query;
            const posts = await Post.find()
                .populate('author', 'username email')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(parseInt(limit));
            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    },

    /**
     * Crea una nueva publicación
     * @async
     * @param {Object} req - Express request object
     * @param {Object} req.body - Datos de la publicación
     */
    createPost: async (req, res, next) => {
        try {
            const { title, content, tags } = req.body;
            const newPost = new Post({
                title,
                content,
                author: req.user._id,
                tags
            });
            await newPost.save();
            await newPost.populate('author', 'username email');
            res.status(201).json(newPost);
        } catch (error) {
            next(error);
        }
    },

    /**
     * Actualiza una publicación existente
     * @async
     * @param {Object} req - Express request object
     * @param {string} req.params.id - ID de la publicación
     */
    updatePost: async (req, res, next) => {
        try {
            const { title, content, tags } = req.body;
            const post = await Post.findById(req.params.id);
            
            if (!post) {
                return res.status(404).json({ 
                    error: 'Publicación no encontrada',
                    details: 'La publicación solicitada no existe'
                });
            }
            
            if (post.author.toString() !== req.user._id.toString()) {
                return res.status(403).json({ 
                    error: 'No autorizado',
                    details: 'Solo el autor puede modificar esta publicación'
                });
            }

            Object.assign(post, { title, content, tags });
            await post.save();
            await post.populate('author', 'username email');
            res.json(post);
        } catch (error) {
            next(error);
        }
    },

    /**
     * Elimina una publicación
     * @async
     * @param {Object} req - Express request object
     * @param {string} req.params.id - ID de la publicación
     */
    deletePost: async (req, res, next) => {
        try {
            const post = await Post.findById(req.params.id);
            
            if (!post) {
                return res.status(404).json({ 
                    error: 'Publicación no encontrada',
                    details: 'La publicación no existe'
                });
            }
            
            if (post.author.toString() !== req.user._id.toString()) {
                return res.status(403).json({ 
                    error: 'No autorizado',
                    details: 'Solo el autor puede eliminar esta publicación'
                });
            }

            await post.deleteOne();
            res.json({ 
                message: 'Publicación eliminada exitosamente',
                postId: req.params.id
            });
        } catch (error) {
            next(error);
        }
    }
};
