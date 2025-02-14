import Vote from '../models/Vote.js';
import { ReputationService } from '../../users/services/reputation.service.js';

export const voteController = {
    create: async (req, res) => {
        try {
            const newVote = new Vote({
                user: req.user._id,
                voteType: req.body.voteType,
                voteableType: req.body.voteableType,
                voteableId: req.body.voteableId
            });

            const savedVote = await newVote.save();

            // Actualizar el karma del usuario (ejemplo)
            await ReputationService.updateReputation(req.user._id, req.body.voteType === 'upvote' ? 1 : -1);

            res.status(201).json(savedVote);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}; 