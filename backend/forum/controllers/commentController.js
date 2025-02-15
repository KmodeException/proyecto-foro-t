import Comment from '../models/Comment.js';
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
 *             $ref: '#/components/schemas/Comment'
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

export const commentController = {
    create: async (req, res) => {
        try {
            const comment = new Comment(req.body);
            await comment.save();
            res.status(201).json(comment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getById: async (req, res) => {
        try {
            const comment = await Comment.findById(req.params.id);
            res.json(comment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    update: async (req, res) => {
        try {
            const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, { new: true });
            res.json(comment);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    delete: async (req, res) => {
        try {
            await Comment.findByIdAndDelete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    vote: async (req, res) => {
        try {
            const { type } = req.body;
            const comment = await Comment.findById(req.params.id).populate('author');

            if (!comment) {
                return res.status(404).json({ message: 'Comentario no encontrado' });
            }

            // Verificar si el usuario ya votó
            const existingVote = comment.votes.find(vote => vote.userId.toString() === req.user._id.toString());
            if (existingVote) {
                if (existingVote.type === type) {
                    return res.status(400).json({ message: 'Ya votaste este comentario con este tipo de voto' });
                } else {
                    await Comment.findByIdAndUpdate(req.params.id, { $pull: { votes: existingVote } });
                }
            }

            // Agregar el voto
            await Comment.findByIdAndUpdate(
                req.params.id,
                { $push: { votes: { userId: req.user._id, type } } },
                { new: true }
            );

            // Actualizar reputación
            await ReputationService.updateReputation(
                comment.author._id,
                type === 'up' ? REPUTATION_ACTIONS.COMMUNITY.COMMENT_UPVOTE : REPUTATION_ACTIONS.COMMUNITY.COMMENT_DOWNVOTE,
                comment._id
            );

            res.json(comment);
        } catch (error) {
            console.error("Error al votar:", error);
            res.status(500).json({ message: 'Error al votar' });
        }
    }
};
