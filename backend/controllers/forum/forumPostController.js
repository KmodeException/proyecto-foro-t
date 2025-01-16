import ForumPost from '../../models/ForumPost.js';
import { ReputationService } from '../../modules/reputation/reputation.service.js';
import { REPUTATION_ACTIONS } from '../../modules/reputation/reputation.constants.js';

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

    vote: async (req, res) => {
        try {
            const { type } = req.body;
            const post = await ForumPost.findById(req.params.id);
            
            if (!post) {
                return res.status(404).json({ message: 'Post no encontrado' });
            }

            // Actualizar votos
            const voteField = `votes.${type}`;
            await ForumPost.updateOne(
                { _id: post._id },
                { $addToSet: { [voteField]: req.user._id } }
            );

            // Actualizar reputación
            await ReputationService.updateReputation(
                post.author,
                type === 'up' ? REPUTATION_ACTIONS.COMMUNITY.POST_UPVOTE : REPUTATION_ACTIONS.COMMUNITY.POST_DOWNVOTE,
                post._id
            );

            const updatedPost = await ForumPost.findById(post._id)
                .populate('author', 'username reputation level');
            
            res.json(updatedPost);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    upvote: async (req, res) => {
        try {
            const post = await ForumPost.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ message: 'Post no encontrado' });
            }

            // Verificar si ya votó
            if (post.votes.up.includes(req.user._id)) {
                return res.status(400).json({ message: 'Ya votaste este post' });
            }

            // Remover downvote si existe
            post.votes.down = post.votes.down.filter(
                id => id.toString() !== req.user._id.toString()
            );

            // Añadir upvote
            post.votes.up.push(req.user._id);
            await post.save();

            res.status(200).json(post);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    downvote: async (req, res) => {
        try {
            const post = await ForumPost.findById(req.params.id);
            if (!post) {
                return res.status(404).json({ message: 'Post no encontrado' });
            }

            // Verificar si ya votó
            if (post.votes.down.includes(req.user._id)) {
                return res.status(400).json({ message: 'Ya votaste este post' });
            }

            // Remover upvote si existe
            post.votes.up = post.votes.up.filter(
                id => id.toString() !== req.user._id.toString()
            );

            // Añadir downvote
            post.votes.down.push(req.user._id);
            await post.save();

            res.status(200).json(post);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};