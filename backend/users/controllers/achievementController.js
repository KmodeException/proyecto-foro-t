import Achievement from '../models/Achievement.js';

export const achievementController = {
    create: async (req, res) => {
        try {
            const newAchievement = new Achievement(req.body);
            const savedAchievement = await newAchievement.save();
            res.status(201).json(savedAchievement);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const achievements = await Achievement.find();
            res.status(200).json(achievements);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const achievement = await Achievement.findById(req.params.id);
            if (!achievement) {
                return res.status(404).json({ message: 'Logro no encontrado' });
            }
            res.status(200).json(achievement);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const updatedAchievement = await Achievement.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedAchievement) {
                return res.status(404).json({ message: 'Logro no encontrado' });
            }
            res.status(200).json(updatedAchievement);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            const deletedAchievement = await Achievement.findByIdAndDelete(req.params.id);
            if (!deletedAchievement) {
                return res.status(404).json({ message: 'Logro no encontrado' });
            }
            res.status(200).json({ message: 'Logro eliminado' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}; 