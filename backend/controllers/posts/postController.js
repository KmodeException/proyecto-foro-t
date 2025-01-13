import Post from '../../models/Post.js';

/**
 * Controlador para gestionar los posts dentro de los subapartados
 * @module controllers/posts/postController
 */
export const postController = {
    /**
     * Crear un nuevo post
     */
    createPost: async (req, res, next) => {
        try {
            const { title, content, subSection } = req.body;

            const post = new Post({
                title,
                content,
                creator: req.user._id,
                subSection
            });

            await post.save();

            res.status(201).json({
                data: post,
                message: 'Post creado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtener todos los posts de un subapartado
     */
    getPostsBySubSection: async (req, res, next) => {
        try {
            const { subSectionId } = req.params;

            const posts = await Post.find({ subSection: subSectionId })
                .populate('creator', 'nickname avatar')
                .sort({ createdAt: -1 });

            res.json({
                data: posts
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtener un post por su ID
     */
    getPostById: async (req, res, next) => {
        try {
            const { postId } = req.params;

            const post = await Post.findById(postId)
                .populate('creator', 'nickname avatar');

            if (!post) {
                return res.status(404).json({
                    error: 'Post no encontrado'
                });
            }

            res.json({
                data: post
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Actualizar un post
     */
    updatePost: async (req, res, next) => {
        try {
            const { postId } = req.params;
            const { title, content } = req.body;

            const post = await Post.findByIdAndUpdate(postId, { title, content }, { new: true });

            if (!post) {
                return res.status(404).json({
                    error: 'Post no encontrado'
                });
            }

            res.json({
                data: post,
                message: 'Post actualizado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Eliminar un post
     */
    deletePost: async (req, res, next) => {
        try {
            const { postId } = req.params;

            const post = await Post.findByIdAndDelete(postId);

            if (!post) {
                return res.status(404).json({
                    error: 'Post no encontrado'
                });
            }

            res.json({
                message: 'Post eliminado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }
};
