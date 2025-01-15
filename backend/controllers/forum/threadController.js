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
            const { name, description, rules } = req.body;
            const thread = new Thread({
                name,
                description,
                rules,
                creator: req.user._id,
                moderators: [req.user._id]
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
                .populate('moderators', 'username');
            res.json(threads);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};