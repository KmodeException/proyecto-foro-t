import Thread from '../models/Thread.js';

/**
 * @swagger
 * /api/forum/threads:
 *   post:
 *     tags: [Forum]
 *     summary: Crear nuevo hilo
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Thread'
 *     responses:
 *       201:
 *         description: Hilo creado
 *       403:
 *         description: Karma insuficiente
 */

export const threadController = {
    /**
     * @desc    Crear nuevo hilo
     * @route   POST /api/forum/threads
     * @access  Private
     */
    create: async (req, res) => {
        try {
            const thread = new Thread(req.body);
            const newThread = await thread.save();
            res.status(201).json(newThread);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    /**
     * @desc    Obtener todos los hilos
     * @route   GET /api/forum/threads
     * @access  Public
     */
    getAll: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * limit;

            const threads = await Thread.find()
                .populate('creator', 'username')
                .sort('-createdAt')
                .limit(limit)
                .skip(skip);

            const totalThreads = await Thread.countDocuments();
            const totalPages = Math.ceil(totalThreads / limit);

            res.status(200).json({
                threads,
                currentPage: page,
                totalPages,
                totalThreads
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const thread = await Thread.findById(req.params.id).populate('creator', 'username');
            if (!thread) {
                return res.status(404).json({ message: "Hilo no encontrado" });
            }
            res.status(200).json(thread);
        } catch (error) {
            res.status(500).json({ message: "Error al obtener el hilo" });
        }
    },

    update: async (req, res) => {
        try {
            const thread = await Thread.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!thread) {
                return res.status(404).json({ message: "Hilo no encontrado" });
            }
            res.status(200).json(thread);
        } catch (error) {
            res.status(500).json({ message: "Error al actualizar el hilo" });
        }
    },

    delete: async (req, res) => {
        try {
            const thread = await Thread.findByIdAndDelete(req.params.id);
            if (!thread) {
                return res.status(404).json({ message: "Hilo no encontrado" });
            }
            res.status(200).json({ message: "Hilo eliminado correctamente" });
        } catch (error) {
            res.status(500).json({ message: "Error al eliminar el hilo" });
        }
    },

    search: async (req, res) => {
        try {
            const query = req.query.q;
            if (!query) {
                return res.status(400).json({ message: 'El parámetro de búsqueda "q" es obligatorio' });
            }

            const threads = await Thread.find({
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            })
            .populate('creator', 'username');

            res.json(threads);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
