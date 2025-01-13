export const postsController = {
    create: (req, res) => {
        // Lógica para crear un post
        res.status(201).json({ message: 'Post creado exitosamente' });
    },
    getBySubSection: (req, res) => {
        const { subSectionId } = req.params;
        // Lógica para obtener posts por subapartado
        res.status(200).json({ message: `Posts para el subapartado ${subSectionId}` });
    }
};