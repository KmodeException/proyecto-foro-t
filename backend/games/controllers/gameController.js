import Game from '../models/Game.js';

export const gameController = {
    // Crear nuevo juego
    create: async (req, res) => {
        try {
            const game = new Game(req.body);
            game.autor = req.usuario.id; // Asignar el autor al juego
            const nuevoGame = await game.save();
            res.status(201).json(nuevoGame);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: 'Error al crear el videojuego' });
        }
    },

    // Obtener todos los juegos
    getAll: async (req, res) => {
        try {
            const games = await Game.find().populate('autor', 'nombreUsuario'); // Popular el autor
            res.status(200).json(games);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: 'Error al obtener los videojuegos' });
        }
    },

    // Obtener juego por ID
    getById: async (req, res) => {
        try {
            const game = await Game.findById(req.params.id).populate('autor', 'nombreUsuario'); // Popular el autor
            if (!game) {
                return res.status(404).json({ mensaje: 'Videojuego no encontrado' });
            }
            res.status(200).json(game);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: 'Error al obtener el videojuego' });
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
    },

    // Actualizar videojuego
    update: async (req, res) => {
        try {
            const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!game) {
                return res.status(404).json({ mensaje: 'Videojuego no encontrado' });
            }
            res.status(200).json(game);
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: 'Error al actualizar el videojuego' });
        }
    },

    // Eliminar videojuego
    delete: async (req, res) => {
        try {
            const game = await Game.findByIdAndDelete(req.params.id);
            if (!game) {
                return res.status(404).json({ mensaje: 'Videojuego no encontrado' });
            }
            res.status(200).json({ mensaje: 'Videojuego eliminado correctamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ mensaje: 'Error al eliminar el videojuego' });
        }
    }
};
