import ForumPost from '../models/ForumPost.js';
import { ReputationService } from '../../users/services/reputation.service.js';
import { REPUTATION_ACTIONS } from '../../users/constants/reputation.constants.js';


/**
 * @swagger
 * /api/forum/posts:
 *   post:
 *     tags: [Forum]
 *     summary: Crear nuevo post
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForumPost'
 *     responses:
 *       201:
 *         description: Post creado exitosamente
 *       403:
 *         description: Karma insuficiente
 * 
 *   get:
 *     tags: [Forum]
 *     summary: Obtener posts por hilo
 *     parameters:
 *       - in: query
 *         name: threadId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de posts
 * 
 * /api/forum/posts/{id}/vote:
 *   post:
 *     tags: [Forum]
 *     summary: Votar en un post
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
 */

export const forumPostController = {
    create: async (req, res) => {
        try {
            const restrictions = ReputationService.checkRestrictions(req.user.reputation);
            if (restrictions.readOnly) {
                return res.status(403).json({ message: 'Karma insuficiente para crear posts' });
            }

            const { title, content, threadId } = req.body;
            const post = new ForumPost({
                title,
                content,
                thread: threadId,
                author: req.user._id
            });
            await post.save();
            await post.populate('author', 'username reputation level');
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

    getById: async (req, res) => {
        try {
            const post = await ForumPost.findById(req.params.id)
                .populate('author', 'username reputation level');
            res.json(post);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }, 

    vote: async (req, res) => {
        try {
            const { type } = req.body;
            const post = await ForumPost.findById(req.params.id).populate('author', 'username reputation level');

            if (!post) {
                return res.status(404).json({ message: 'Post no encontrado' });
            }

            // Verificar si el usuario ya votó
            const voteField = `votes.${type}`;
            const alreadyVoted = post.votes[type].some(userId => userId.toString() === req.user._id.toString());

            if (alreadyVoted) {
                return res.status(400).json({ message: 'Ya votaste este post' });
            }

            // Agregar el voto
            await ForumPost.findByIdAndUpdate(
                post._id,
                { $push: { [voteField]: req.user._id } },
                { new: true }
            );

            // Actualizar reputación
            await ReputationService.updateReputation(
                post.author,
                type === 'up' ? REPUTATION_ACTIONS.COMMUNITY.POST_UPVOTE : REPUTATION_ACTIONS.COMMUNITY.POST_DOWNVOTE,
                post._id
            );

            res.json(post);
        } catch (error) {
            console.error("Error al votar:", error);
            res.status(500).json({ message: 'Error al votar' });
        }
    }
};
