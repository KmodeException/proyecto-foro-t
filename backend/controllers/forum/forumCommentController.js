import ForumComment from '../../models/ForumComment.js';
import { ReputationService } from '../../modules/reputation/reputation.service.js';
import { REPUTATION_ACTIONS } from '../../modules/reputation/reputation.constants.js';

/**
 * @swagger
 * /api/forum/comments:
 *   post:
 *     tags: [Forum]
 *     summary: Crear nuevo comentario
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForumComment'
 *     responses:
 *       201:
 *         description: Comentario creado exitosamente
 *       403:
 *         description: Karma insuficiente
 * 
 * /api/forum/comments/{postId}:
 *   get:
 *     tags: [Forum]
 *     summary: Obtener comentarios de un post
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de comentarios
 * 
 * /api/forum/comments/{id}/vote:
 *   post:
 *     tags: [Forum]
 *     summary: Votar en un comentario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [up, down]
 * components:
 *   schemas:
 *     CommentVote:
 *       type: object
 *       properties:
 *         type:
 *           type: string
 *           enum: [up, down]
 */

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
            await comment.populate('author', 'username reputation level');
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

            await ReputationService.updateReputation(
                comment.author,
                type === 'up' ? 
                    REPUTATION_ACTIONS.COMMUNITY.COMMENT_UPVOTE : 
                    REPUTATION_ACTIONS.COMMUNITY.COMMENT_DOWNVOTE,
                comment._id
            );

            const updatedComment = await ForumComment.findById(comment._id)
                .populate('author', 'username reputation level');
            
            res.json(updatedComment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};