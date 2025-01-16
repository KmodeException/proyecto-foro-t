import Thread from '../../models/Thread.js';

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
            const thread = new Thread({
                name: req.body.name,
                description: req.body.description,
                type: req.body.type,
                creator: req.user._id
            });
            await thread.save();
            res.status(201).json(thread);
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
            const threads = await Thread.find()
                .populate('creator', 'username')
                .sort('-createdAt');
            res.status(200).json(threads);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const thread = await Thread.findById(req.params.id)
                .populate('creator', 'username');
            if (!thread) {
                return res.status(404).json({ message: 'Hilo no encontrado' });
            }
            res.status(200).json(thread);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const thread = await Thread.findById(req.params.id);
            if (!thread) {
                return res.status(404).json({ message: 'Hilo no encontrado' });
            }
            if (thread.creator.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'No autorizado' });
            }
            Object.assign(thread, req.body);
            await thread.save();
            res.status(200).json(thread);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const thread = await Thread.findById(req.params.id);
            if (!thread) {
                return res.status(404).json({ message: 'Hilo no encontrado' });
            }
            if (thread.creator.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'No autorizado' });
            }
            await thread.remove();
            res.status(200).json({ message: 'Hilo eliminado' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};