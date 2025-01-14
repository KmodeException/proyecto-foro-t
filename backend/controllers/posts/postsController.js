/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: API para gestión de posts
 */
export const postsController = {
    /**
     * @swagger
     * /api/posts:
     *   post:
     *     summary: Crear nuevo post
     *     tags: [Posts]
     *     security:
     *       - bearerAuth: []
     */
    create: (req, res) => {
        // Lógica para crear un post
        res.status(201).json({ message: 'Post creado exitosamente' });
    },

    /**
     * @swagger
     * /api/posts/subsection/{subSectionId}:
     *   get:
     *     summary: Obtener posts por subsección
     *     tags: [Posts]
     */
    getBySubSection: (req, res) => {
        const { subSectionId } = req.params;
        // Lógica para obtener posts por subapartado
        res.status(200).json({ message: `Posts para el subapartado ${subSectionId}` });
    }
};