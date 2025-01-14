import passport from 'passport';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Middleware de autenticación unificado
 * Verifica el token JWT y añade el usuario a la request
 */
export const authenticate = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, async (err, user, info) => {
        if (err) {
            return next(err);
        }
        
        if (!user) {
            return res.status(401).json({
                error: 'No autorizado',
                message: info ? info.message : 'Token inválido o expirado'
            });
        }
        
        try {
            const token = req.headers.authorization?.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Token no proporcionado' });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(401).json({ message: 'Usuario no encontrado' });
            }

            req.user = user;
            next();
        } catch (error) {
            return res.status(401).json({ message: 'Token inválido' });
        }
    })(req, res, next);
};

/**
 * Middleware para verificación de roles
 * @param {Array} roles - Array de roles permitidos
 */
export const checkRole = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({
            error: 'Acceso denegado',
            message: 'No tienes los permisos necesarios'
        });
    }
    next();
};