import ForumPost from '../models/ForumPost.js';
import { ReputationService } from '../../users/services/reputation.service.js';
import { REPUTATION_ACTIONS } from '../../users/constants/reputation.constants.js';
import Thread from '../models/Thread.js';


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

            // Validación de threadId
            const threadExists = await Thread.findById(threadId);
            if (!threadExists) {
                return res.status(400).json({ message: 'Hilo no encontrado' });
            }

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
            const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(req.query.page) || 1;
            const skip = (page - 1) * limit;

            const posts = await ForumPost.find({ thread: req.params.threadId })
                .populate('author', 'username')
                .sort('-createdAt')
                .limit(limit)
                .skip(skip);

            const totalPosts = await ForumPost.countDocuments({ thread: req.params.threadId });
            const totalPages = Math.ceil(totalPosts / limit);

            res.json({
                posts,
                currentPage: page,
                totalPages,
                totalPosts
            });
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
            const post = await ForumPost.findById(req.params.id).populate('author');

            if (!post) {
                return res.status(404).json({ message: 'Post no encontrado' });
            }

            // Verificar si el usuario ya votó
            const existingVote = post.votes.find(vote => vote.userId.toString() === req.user._id.toString());
            if (existingVote) {
                if (existingVote.type === type) {
                    return res.status(400).json({ message: 'Ya votaste este post con este tipo de voto' });
                } else {
                    await ForumPost.findByIdAndUpdate(req.params.id, { $pull: { votes: existingVote } });
                }
            }

            // Agregar el voto
            await ForumPost.findByIdAndUpdate(
                req.params.id,
                { $push: { votes: { userId: req.user._id, type } } },
                { new: true }
            );

            // Actualizar reputación
            await ReputationService.updateReputation(
                post.author._id,
                type === 'up' ? REPUTATION_ACTIONS.COMMUNITY.POST_UPVOTE : REPUTATION_ACTIONS.COMMUNITY.POST_DOWNVOTE,
                post._id
            );

            res.json(post);
        } catch (error) {
            console.error("Error al votar:", error);
            res.status(500).json({ message: 'Error al votar' });
        }
    },

    search: async (req, res) => {
        try {
            const query = req.query.q;
            if (!query) {
                return res.status(400).json({ message: 'El parámetro de búsqueda "q" es obligatorio' });
            }

            const posts = await ForumPost.find({
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { content: { $regex: query, $options: 'i' } }
                ]
            })
            .populate('author', 'username');

            res.json(posts);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            // Lógica para obtener todos los posts
            res.status(200).json({ message: 'Posts obtenidos correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener los posts' });
        }
    },

    update: async (req, res) => {
        try {
            const { id } = req.params;
            const { title, content } = req.body;

            const post = await ForumPost.findByIdAndUpdate(id, { title, content }, { new: true });

            if (!post) {
                return res.status(404).json({ message: 'Post no encontrado' });
            }

            res.json(post);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};
