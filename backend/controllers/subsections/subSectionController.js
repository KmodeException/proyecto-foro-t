import SubSection from '../../models/SubSection.js';

/**
 * Controlador para gestionar los subapartados del foro
 * @module controllers/subsections/subSectionController
 */
export const subSectionController = {
    /**
     * Crear nuevo subapartado
     * @async
     * @param {Object} req.body - Datos del subapartado
     * @param {Object} req.user - Usuario autenticado
     */
    createSubSection: async (req, res, next) => {
        try {
            const { name, category, description, rules } = req.body;

            const subSection = new SubSection({
                name,
                category,
                description,
                rules,
                creator: req.user._id,
                moderators: [req.user._id],
                metrics: {
                    lastActivity: new Date()
                }
            });

            await subSection.save();
            await subSection.populate('creator', 'nickname');
            await subSection.populate('moderators', 'nickname');

            res.status(201).json(subSection);
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtener todos los subapartados
     * @async
     * @param {Object} req.query - Filtros de búsqueda
     */
    getAllSubSections: async (req, res, next) => {
        try {
            const { category, status } = req.query;
            const filter = {};

            if (category) filter.category = category;
            if (status) filter.status = status;

            const subSections = await SubSection.find(filter)
                .populate('creator', 'nickname')
                .populate('moderators', 'nickname')
                .sort({ 'metrics.lastActivity': -1 });

            res.json(subSections);
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtener un subapartado por su path
     * @async
     * @param {string} req.params.path - Path del subapartado
     */
    getSubSectionByPath: async (req, res, next) => {
        try {
            const subSection = await SubSection.findOne({ path: req.params.path })
                .populate('creator', 'nickname')
                .populate('moderators', 'nickname');

            if (!subSection) {
                return res.status(404).json({
                    error: 'Subapartado no encontrado'
                });
            }

            res.json(subSection);
        } catch (error) {
            next(error);
        }
    }
}; 