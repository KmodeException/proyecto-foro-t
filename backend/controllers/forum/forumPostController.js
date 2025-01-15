import ForumPost from '../../models/ForumPost.js';
import { ReputationService } from '../../modules/reputation/reputation.service.js';
import { REPUTATION_ACTIONS } from '../../modules/reputation/reputation.constants.js';

export const forumPostController = {
    create: async (req, res) => {
        try {
            const { title, content, threadId } = req.body;
            const post = new ForumPost({
                title,
                content,
                thread: threadId,
                author: req.user._id
            });
            await post.save();
            await post.populate('author', 'username');
            res.status(201).json(post);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getByThread: async (req, res) => {
        try {
            const posts = await ForumPost.find({ thread: req.params.threadId })
                .populate('author', 'username')
                .sort('-createdAt');
            res.json(posts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    vote: async (req, res) => {
        try {
            const { type } = req.body;
            const post = await ForumPost.findById(req.params.id);
            
            if (!post) {
                return res.status(404).json({ message: 'Post no encontrado' });
            }

            const voteField = type === 'up' ? 'votes.up' : 'votes.down';
            const oppositeField = type === 'up' ? 'votes.down' : 'votes.up';

            // Remover voto opuesto si existe
            await ForumPost.updateOne(
                { _id: post._id },
                { $pull: { [oppositeField]: req.user._id } }
            );

            // Alternar voto actual
            if (post[type === 'up' ? 'votes.up' : 'votes.down'].includes(req.user._id)) {
                await ForumPost.updateOne(
                    { _id: post._id },
                    { $pull: { [voteField]: req.user._id } }
                );
            } else {
                await ForumPost.updateOne(
                    { _id: post._id },
                    { $addToSet: { [voteField]: req.user._id } }
                );

                // Actualizar reputación
                await ReputationService.updateReputation(
                    post.author,
                    type === 'up' ? REPUTATION_ACTIONS.COMMUNITY.UPVOTE : REPUTATION_ACTIONS.COMMUNITY.DOWNVOTE,
                    post._id
                );
            }

            const updatedPost = await ForumPost.findById(post._id)
                .populate('author', 'username');
            
            res.json(updatedPost);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};