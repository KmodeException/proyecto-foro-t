import Translation from '../../models/Translation.js';

export const translationController = {
    create: async (req, res) => {
        try {
            const translation = new Translation({
                ...req.body,
                translator: req.user._id,
                status: 'pending'
            });
            await translation.save();
            res.status(201).json(translation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getByGame: async (req, res) => {
        try {
            const translations = await Translation.find({ game: req.params.gameId })
                .populate('translator', 'username');
            res.status(200).json(translations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const translation = await Translation.findById(req.params.id)
                .populate('translator', 'username')
                .populate('game', 'title');

            if (!translation) {
                return res.status(404).json({ message: 'Traducción no encontrada' });
            }
            res.status(200).json(translation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};