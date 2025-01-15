import express from 'express';
import { authController } from '../controllers/auth/authController.js';
import { authValidators } from '../validators/auth.validators.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API de autenticación y autorización
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registrar nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 */
router.post('/register', authValidators.register, authController.register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Iniciar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 */
router.post('/login', authValidators.login, authController.login);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     tags: [Auth]
 *     summary: Obtener perfil de usuario
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil de usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/profile', authController.getProfile);

export default router;
