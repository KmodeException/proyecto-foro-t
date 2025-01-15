import ForumComment from '../../models/ForumComment.js';
import { ReputationService } from '../../modules/reputation/reputation.service.js';

export const forumCommentController = {
    create: async (req, res) => {
        try {
            const { content, postId, parentCommentId } = req.body;
            
            const comment = new ForumComment({
                content,
                post: postId,
                author: req.user._id,
                parentComment: parentCommentId || null
            });

            await comment.save();
            await comment.populate('author', 'username');
            
            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getByPost: async (req, res) => {
        try {
            const comments = await ForumComment.find({ 
                post: req.params.postId,
                parentComment: null 
            })
            .populate('author', 'username')
            .populate({
                path: 'replies',
                populate: { path: 'author', select: 'username' }
            })
            .sort('-createdAt');

            res.json(comments);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    vote: async (req, res) => {
        try {
            const { type } = req.body;
            const comment = await ForumComment.findById(req.params.id);
            
            if (!comment) {
                return res.status(404).json({ message: 'Comentario no encontrado' });
            }

            const voteField = `votes.${type}`;
            await ForumComment.updateOne(
                { _id: comment._id },
                { $addToSet: { [voteField]: req.user._id } }
            );

            const updatedComment = await ForumComment.findById(comment._id)
                .populate('author', 'username');
            
            res.json(updatedComment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};