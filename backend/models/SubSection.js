import mongoose from 'mongoose';

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
        required: true,
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

// Índices para optimizar consultas frecuentes
subSectionSchema.index({ path: 1 }, { unique: true });
subSectionSchema.index({ category: 1 });
subSectionSchema.index({ status: 1 });

// Middleware para generar path automáticamente
subSectionSchema.pre('save', function(next) {
    if (this.isModified('name')) {
        this.path = `/${this.category}/${this.name.toLowerCase().replace(/\s+/g, '-')}`;
    }
    next();
});

const SubSection = mongoose.model('SubSection', subSectionSchema);
export default SubSection; 