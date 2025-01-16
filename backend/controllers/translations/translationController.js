import Translation from '../../models/Translation.js';

export const translationController = {
    create: async (req, res) => {
        try {
            const translation = new Translation({
                ...req.body,
                translator: req.user._id
            });
            await translation.save();
            res.status(201).json(translation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const { translatedText, notes } = req.body;
            const translation = await Translation.findById(req.params.id);

            if (!translation) {
                return res.status(404).json({ message: 'Traducción no encontrada' });
            }

            translation.changes.push({
                version: translation.version + 1,
                translatedText: translation.translatedText,
                updatedBy: req.user._id,
                notes
            });

            translation.version += 1;
            translation.translatedText = translatedText;
            await translation.save();

            res.json(translation);
        } catch (error) {
            res.status(500).json({
                message: 'Error al actualizar traducción',
                error: error.message
            });
        }
    },

    review: async (req, res) => {
        try {
            const { status, notes } = req.body;
            const translation = await Translation.findById(req.params.id);

            if (!translation) {
                return res.status(404).json({ message: 'Traducción no encontrada' });
            }

            translation.status = status;
            translation.reviewer = req.user._id;
            translation.changes.push({
                version: translation.version,
                translatedText: translation.translatedText,
                updatedBy: req.user._id,
                notes
            });

            await translation.save();
            res.json(translation);
        } catch (error) {
            res.status(500).json({
                message: 'Error al revisar traducción',
                error: error.message
            });
        }
    },

    getByGame: async (req, res) => {
        try {
            const translations = await Translation.find({ game: req.params.gameId })
                .populate('translator', 'username')
                .populate('reviewer', 'username')
                .sort('-createdAt');
            
            res.json(translations);
        } catch (error) {
            res.status(500).json({
                message: 'Error al obtener traducciones',
                error: error.message
            });
        }
    },

    getById: async (req, res) => {
        try {
            const translation = await Translation.findById(req.params.id)
                .populate('translator', 'username')
                .populate('game', 'title');
                
            if (!translation) {
                return res.status(404).json({ 
                    message: 'Traducción no encontrada' 
                });
            }
            
            res.status(200).json(translation);
        } catch (error) {
            res.status(500).json({ 
                message: 'Error al obtener traducción',
                error: error.message 
            });
        }
    }
};