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
    required: [true, 'La edad es obligatoria'],
    min: [1, 'La edad debe ser un número positivo'],
  },
  role: { 
    type: String,
    enum: ['user', 'translator', 'moderator', 'admin'],
    default: 'user',
  },
  translatorProfile: {
    level: { type: Number, default: 1 },
    projects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game'
    }],
    reputation: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Encrypt the password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

// Method to compare password for login
userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
