import Game from '../../models/Game.js';

/**
 * @swagger
 * /api/games:
 *   post:
 *     description: Crear nuevo juego
 *     parameters:
 *       - name: title
 *         description: Título del juego
 *       - name: platform
 *         description: Plataformas disponibles
 */

export const gameController = {
    // Crear nuevo juego
    create: async (req, res) => {
        try {
            const { title, platform } = req.body;
            const game = new Game({
                title,
                platform,
                translationLead: req.user._id
            });
            await game.save();
            res.status(201).json(game);
        } catch (error) {
            res.status(500).json({
                message: 'Error al crear el juego',
                error: error.message
            });
        }
    },

    // Obtener todos los juegos
    getAll: async (req, res) => {
        try {
            const games = await Game.find()
                .populate('translationLead', 'username')
                .populate('translators.user', 'username');
            res.json(games);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener juegos',
                error: error.message
            });
        }
    },

    // Obtener juego por ID
    getById: async (req, res) => {
        try {
            const game = await Game.findById(req.params.id)
                .populate('translationLead', 'username')
                .populate('translators.user', 'username');
            if (!game) {
                return res.status(404).json({ message: 'Juego no encontrado' });
            }
            res.json(game);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener el juego',
                error: error.message
            });
        }
    },

    // Actualizar estado de traducción
    updateStatus: async (req, res) => {
        try {
            const { status, translationProgress } = req.body;
            const game = await Game.findById(req.params.id);

            if (!game) {
                return res.status(404).json({ message: 'Juego no encontrado' });
            }

            if (game.translationLead.toString() !== req.user._id.toString() && 
                req.user.role !== 'admin') {
                return res.status(403).json({ message: 'No autorizado' });
            }

            game.status = status;
            game.translationProgress = translationProgress;
            await game.save();

            res.json(game);
        } catch (error) {
            res.status(500).json({
                message: 'Error al actualizar estado',
                error: error.message
            });
        }
    },

    // Asignar traductor
    assignTranslator: async (req, res) => {
        try {
            const { translatorId } = req.body;
            const game = await Game.findById(req.params.id);

            if (!game) {
                return res.status(404).json({ message: 'Juego no encontrado' });
            }

            if (game.translators.some(t => t.user.toString() === translatorId)) {
                return res.status(400).json({ message: 'Traductor ya asignado' });
            }

            game.translators.push({ user: translatorId });
            await game.save();

            res.json(game);
        } catch (error) {
            res.status(500).json({
                message: 'Error al asignar traductor',
                error: error.message
            });
        }
    }
};