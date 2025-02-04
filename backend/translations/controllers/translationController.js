import Translation from '../../models/Translation.js';

export const translationController = {
    create: async (req, res) => {
        try {
            const translation = new Translation({
                content: req.body.content,
                game: req.body.gameId,
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
            const translations = await Translation.find({ 
                game: req.params.gameId 
            })
            .populate('translator', 'username')
            .populate('reviewedBy', 'username');
            res.status(200).json(translations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const translation = await Translation.findById(req.params.id)
                .populate('translator', 'username')
                .populate('game', 'title')
                .populate('reviewedBy', 'username');
            if (!translation) {
                return res.status(404).json({ message: 'Traducción no encontrada' });
            }
            res.status(200).json(translation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    review: async (req, res) => {
        // Lógica para revisar una traducción
        res.status(200).json({ message: 'Traducción revisada exitosamente' });
    },

    update: async (req, res) => {
        try {
            const translation = await Translation.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!translation) {
                return res.status(404).json({ message: 'Traducción no encontrada' });
            }
            res.status(200).json(translation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    approveTranslation: async (req, res) => {
        res.status(200).json({ message: 'Traducción aprobada exitosamente' });
    },

    rejectTranslation: async (req, res) => {
        res.status(200).json({ message: 'Traducción rechazada exitosamente' });
    }
};