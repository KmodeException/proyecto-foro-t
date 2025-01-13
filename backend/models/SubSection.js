import mongoose from 'mongoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     SubSection:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - creator
 *         - description
 *       properties:
 *         name:
 *           type: string
 *         path:
 *           type: string
 *         category:
 *           type: string
 *           enum: [recursos, tutoriales, comunidad]
 *         creator:
 *           type: string
 *           format: uuid
 *         description:
 *           type: string
 */

/**
 * Esquema para los subapartados del foro
 * Gestiona las secciones creadas por usuarios para recursos y tutoriales
 */
const subSectionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true,
        trim: true,
        maxlength: [50, 'El nombre no puede exceder 50 caracteres']
    },
    path: {
        type: String,
        unique: true,
        lowercase: true
    },
    category: {
        type: String,
        required: true,
        enum: ['recursos', 'tutoriales', 'comunidad']
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria'],
        maxlength: [500, 'La descripción no puede exceder 500 caracteres']
    },
    rules: [{
        title: String,
        description: String
    }],
    moderators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    status: {
        type: String,
        enum: ['active', 'archived'],
        default: 'active'
    },
    metrics: {
        posts: { type: Number, default: 0 },
        subscribers: { type: Number, default: 0 },
        lastActivity: Date
    }
}, {
    timestamps: true
});

// Solo mantener estos índices necesarios
subSectionSchema.index({ category: 1 });
subSectionSchema.index({ status: 1 });

// Middleware para generar path automáticamente
subSectionSchema.pre('validate', function(next) {
    if (this.name && this.category) {
        this.path = `/${this.category}/${this.name.toLowerCase().replace(/\s+/g, '-')}`;
    }
    next();
});

const SubSection = mongoose.model('SubSection', subSectionSchema);
export default SubSection;