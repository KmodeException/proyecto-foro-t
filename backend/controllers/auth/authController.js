import User from '../../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API de autenticación
 */

/**
 * Controlador para manejar la autenticación de usuarios
 * @module controllers/auth/authController
 */
export const authController = {
    /**
     * @swagger
     * /api/auth/register:
     *   post:
     *     summary: Registrar nuevo usuario
     *     tags: [Auth]
     * @async
     * @param {Object} req.body - Datos del usuario
     * @param {string} req.body.username - Nombre de usuario
     * @param {string} req.body.email - Email del usuario
     * @param {string} req.body.password - Contraseña del usuario
     * @param {number} req.body.age - Edad del usuario
     */
    register: (req, res) => {
        // Lógica para registrar un usuario
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    },

    /**
     * @swagger
     * /api/auth/login:
     *   post:
     *     summary: Iniciar sesión
     *     tags: [Auth]
     * @async
     * @param {Object} req.body - Credenciales
     * @param {string} req.body.email - Email del usuario
     * @param {string} req.body.password - Contraseña del usuario
     */
    login: (req, res) => {
        // Lógica para iniciar sesión
        res.status(200).json({ message: 'Inicio de sesión exitoso' });
    },

    /**
     * @swagger
     * /api/auth/profile:
     *   get:
     *     summary: Obtener perfil de usuario
     *     tags: [Auth]
     *     security:
     *       - bearerAuth: []
     * @async
     * @param {Object} req.user - Usuario autenticado
     */
    getProfile: (req, res) => {
        // Lógica para obtener el perfil del usuario
        res.status(200).json({ message: 'Información del perfil' });
    }
};
