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
            const { 
                category,    // filtrar por categoría
                search,      // buscar por nombre
                status,      // filtrar por estado
                sort = 'recent'  // ordenar por (recent, name, activity)
            } = req.query;

            // Construir query
            const query = {};
            
            // Filtros
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

            const subSections = await SubSection.find(query)
                .populate('creator', 'nickname')
                .populate('moderators', 'nickname')
                .sort(sortOption);

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
            // Obtener el path completo de la URL
            const fullPath = '/' + req.params[0];  // Captura todo después de /path/
            
            const subSection = await SubSection.findOne({ path: fullPath })
                .populate('creator', 'nickname')
                .populate('moderators', 'nickname');

            if (!subSection) {
                return res.status(404).json({
                    error: 'Subapartado no encontrado',
                    requestedPath: fullPath
                });
            }

            res.json(subSection);
        } catch (error) {
            next(error);
        }
    }
}; 