import ForumComment from '../models/ForumComment.js';
import { ReputationService } from '../../users/services/reputation.service.js';
import { REPUTATION_ACTIONS } from '../../users/constants/reputation.constants.js';

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
            const comment = await ForumComment.create({
                content,
                post: postId,
                author: req.user._id,
                parentComment: parentCommentId || null
            });
            
            await comment.populate('author', 'username');
            
            // Actualizar reputación
            await ReputationService.updateReputation(
                req.user._id,
                REPUTATION_ACTIONS.CREATE_COMMENT
            );

            res.status(201).json(comment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    getByPost: async (req, res) => {
        try {
            const { postId } = req.params;
            const comments = await ForumComment.find({ post: postId })
                .populate('author', 'username')
                .populate({
                    path: 'replies',
                    populate: { path: 'author', select: 'username' }
                })
                .sort('-createdAt');
            res.json(comments);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    vote: async (req, res) => {
        try {
            const { id } = req.params;
            const { type } = req.body;
            const comment = await ForumComment.findById(id);
            
            if (!comment) {
                return res.status(404).json({ message: 'Comentario no encontrado' });
            }

            // Remover voto existente si existe
            comment.votes.up = comment.votes.up.filter(
                userId => userId.toString() !== req.user._id.toString()
            );
            comment.votes.down = comment.votes.down.filter(
                userId => userId.toString() !== req.user._id.toString()
            );

            // Agregar nuevo voto
            comment.votes[type].push(req.user._id);
            await comment.save();

            // Actualizar reputación
            await ReputationService.updateReputation(
                comment.author,
                type === 'up' ? REPUTATION_ACTIONS.COMMENT_UPVOTE : REPUTATION_ACTIONS.COMMENT_DOWNVOTE
            );

            res.json(comment);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    },

    upvote: async (req, res) => {
        try {
            const comment = await ForumComment.findById(req.params.id);
            if (!comment) {
                return res.status(404).json({ message: 'Comentario no encontrado' });
            }

            // Verificar si el usuario ya votó
            if (comment.votes.up.includes(req.user._id)) {
                return res.status(403).json({ message: 'Ya votaste este comentario' });
            }

            // Remover voto down si existe
            comment.votes.down = comment.votes.down.filte(
                id => id.toString() !== req.user._id.toString()
            );

            // Agregar voto up
            comment.votes.up.push(req.user._id);
            await comment.save();

            res.status(200).json(comment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }

    },

    downvote: async (req, res) => {
        try {
            const comment = await ForumComment.findById(req.params.id);
            if (!comment) {
                return res.status(404).json({ message: 'Comentario no encontrado' });
            }

            // Verificar si el usuario ya votó
            if (comment.votes.down.includes(req.user._id)) {
                return res.status(403).json({ message: 'Ya votaste este comentario' });
            }

            // Remover voto up si existe
            comment.votes.up = comment.votes.up.filter(
                id => id.toString() !== req.user._id.toString()
            );

            // Agregar voto down
            comment.votes.down.push(req.user._id);
            await comment.save();

            res.status(200).json(comment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


};
