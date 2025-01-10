import SubSection from '../../models/SubSection.js';

/**
 * Controlador para gestionar los subapartados del foro
 * @module controllers/subsections/subSectionController
 */
export const subSectionController = {
    /**
     * Crear nuevo subapartado
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
            
            // Mejorar población de datos
            await subSection
                .populate('creator', 'nickname avatar')
                .populate('moderators', 'nickname avatar');

            res.status(201).json({
                data: subSection,
                message: 'Subapartado creado exitosamente'
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtener todos los subapartados con filtros
     */
    getAllSubSections: async (req, res, next) => {
        try {
            const { 
                category,
                search,
                status,
                sort = 'recent'
            } = req.query;

            // Construir query
            const query = {};
            
            if (category) query.category = category;
            if (status) query.status = status;
            if (search) {
                query.name = { $regex: search, $options: 'i' };
            }

            // Ordenamiento
            let sortOption = {};
            switch (sort) {
                case 'name':
                    sortOption = { name: 1 };
                    break;
                case 'activity':
                    sortOption = { 'metrics.lastActivity': -1 };
                    break;
                default: // recent
                    sortOption = { createdAt: -1 };
            }

            // Obtener total antes de aplicar límites
            const total = await SubSection.countDocuments(query);

            // Obtener datos con población mejorada
            const subSections = await SubSection.find(query)
                .populate('creator', 'nickname avatar')
                .populate('moderators', 'nickname avatar')
                .select('-__v')
                .lean()
                .sort(sortOption);

            res.json({
                data: subSections,
                metadata: {
                    total,
                    count: subSections.length,
                    category,
                    sort
                }
            });
        } catch (error) {
            next(error);
        }
    },

    /**
     * Obtener un subapartado por su path
     */
    getSubSectionByPath: async (req, res, next) => {
        try {
            const fullPath = '/' + req.params[0];
            
            const subSection = await SubSection.findOne({ path: fullPath })
                .populate('creator', 'nickname avatar')
                .populate('moderators', 'nickname avatar')
                .select('-__v')
                .lean();

            if (!subSection) {
                return res.status(404).json({
                    error: 'Subapartado no encontrado',
                    requestedPath: fullPath
                });
            }

            res.json({
                data: subSection
            });
        } catch (error) {
            next(error);
        }
    }
}; 