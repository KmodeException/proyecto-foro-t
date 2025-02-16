import jwt from 'jsonwebtoken';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../../users/models/User.js';
import dotenv from 'dotenv';
import { generateAccessToken } from '../controllers/authController.js';

dotenv.config();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(new JwtStrategy(options, async (payload, done) => {
    try {
        const user = await User.findById(payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

/**
 * Middleware de autenticación unificado
 * Verifica el token JWT y añade el usuario a la request
 */
export const authenticate = passport.authenticate('jwt', { session: false });

/**
 * Middleware para verificación de roles
 * @param {Array} roles - Array de roles permitidos
 */
export const checkRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'No tienes permisos suficientes' });
        }
        next();
    };
};

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    try {
      // Obtener el token del encabezado
      const token = req.header('Authorization').replace('Bearer ', '');

      // Verificar si no hay token
      if (!token) {
        return res.status(401).json({ mensaje: 'No hay token, autorización denegada' });
      }

      // Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Asignar el usuario de la petición
      const usuario = await User.findById(decoded.id);

      if (!usuario) {
        return res.status(401).json({ mensaje: 'Usuario no encontrado' });
      }

      // Verificar si el rol del usuario está permitido
      if (roles.length && !roles.includes(usuario.role)) {
        return res.status(403).json({ mensaje: 'No tiene permisos para acceder a esta ruta' });
      }

      req.usuario = usuario;
      next();

    } catch (error) {
      console.error(error);
      res.status(401).json({ mensaje: 'Token inválido' });
    }
  };
};

export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ message: 'No refresh token' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const accessToken = generateAccessToken(user);
        res.json({ accessToken });
    } catch (error) {
        res.status(401).json({ message: 'Invalid refresh token' });
    }
};

export default authMiddleware;