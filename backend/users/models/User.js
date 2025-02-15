// models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

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
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, introduce un email válido']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  age: { 
    type: Number,
    required: false,
  },
  role: {
    type: String,
    enum: ['user', 'moderator', 'admin'],
    default: 'user'
  },
  reputation: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
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
  karma: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Hash de la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
