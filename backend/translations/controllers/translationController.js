import Translation from '../models/Translation.js';
import { ReputationService } from '../../users/services/reputation.service.js';

export const translationController = {
    create: async (req, res) => {
        try {
            const newTranslation = new Translation(req.body);
            newTranslation.author = req.user._id;
            const savedTranslation = await newTranslation.save();
            res.status(201).json(savedTranslation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getByGame: async (req, res) => {
        try {
            const translations = await Translation.find({ game: req.params.gameId });
            res.status(200).json(translations);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const translation = await Translation.findById(req.params.id);
            if (!translation) {
                return res.status(404).json({ message: 'Traducción no encontrada' });
            }
            res.status(200).json(translation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const updatedTranslation = await Translation.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedTranslation) {
                return res.status(404).json({ message: 'Traducción no encontrada' });
            }
            res.status(200).json(updatedTranslation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const deletedTranslation = await Translation.findByIdAndDelete(req.params.id);
            if (!deletedTranslation) {
                return res.status(404).json({ message: 'Traducción no encontrada' });
            }
            res.status(200).json({ message: 'Traducción eliminada' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    review: async (req, res) => {
        try {
            const translation = await Translation.findById(req.params.id);
            if (!translation) {
                return res.status(404).json({ message: 'Traducción no encontrada' });
            }

            translation.status = req.body.status; // 'approved' or 'rejected'
            translation.reviewComments = req.body.reviewComments;
            translation.reviewedBy = req.user._id;
            translation.reviewDate = Date.now();

            const reviewedTranslation = await translation.save();
            res.status(200).json(reviewedTranslation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    approveTranslation: async (req, res) => {
        try {
            const translation = await Translation.findById(req.params.id);
            if (!translation) {
                return res.status(404).json({ message: 'Translation not found' });
            }

            translation.status = 'approved';
            translation.reviewedBy = req.user._id;
            translation.reviewDate = Date.now();

            const reviewedTranslation = await translation.save();
            res.status(200).json(reviewedTranslation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    rejectTranslation: async (req, res) => {
        try {
            const translation = await Translation.findById(req.params.id);
            if (!translation) {
                return res.status(404).json({ message: 'Translation not found' });
            }

            translation.status = 'rejected';
            translation.reviewComments = req.body.reviewComments;
            translation.reviewedBy = req.user._id;
            translation.reviewDate = Date.now();

            const reviewedTranslation = await translation.save();
            res.status(200).json(reviewedTranslation);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
