// models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - age
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           format: password
 *         age:
 *           type: number
 *         role:
 *           type: string
 *           enum: [user, translator, moderator, admin]
 *         translatorProfile:
 *           type: object
 *           properties:
 *             level:
 *               type: number
 *             projects:
 *               type: array
 *             reputation:
 *               type: number
 */

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'El nombre de usuario es obligatorio'],
    unique: true,
  },
  email: { 
    type: String,
    required: [true, 'El correo electrónico es obligatorio'],
    unique: true,
    match: [/.+\@.+\..+/, 'Por favor ingrese un correo válido']
  },
  password: { 
    type: String,
    required: [true, 'La contraseña es obligatoria'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
  },
  age: { 
    type: Number,
    required: false,
  },
  role: { 
    type: String,
    enum: ['user', 'translator', 'moderator', 'admin'],
    default: 'user',
  },
  reputation: {
    type: Number,
    default: 0
  },
  reputationHistory: [{
    points: Number,
    type: {
      type: String,
      enum: ['translation', 'community', 'moderation']
    },
    reason: String,
    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'reputationHistory.type'
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  level: {
    type: String,
    enum: ['Novato', 'Contribuidor', 'Experto'],
    default: 'Novato'
  },
  karma: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
