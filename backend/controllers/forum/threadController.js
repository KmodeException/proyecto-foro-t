import Thread from '../../models/Thread.js';

export const threadController = {
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