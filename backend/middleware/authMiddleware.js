import passport from 'passport';

/**
 * Middleware de autenticación unificado
 * Verifica el token JWT y añade el usuario a la request
 */
export const authenticate = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            return next(err);
        }
        
        if (!user) {
            return res.status(401).json({
                error: 'No autorizado',
                message: info ? info.message : 'Token inválido o expirado'
            });
        }
        
        req.user = user;
        next();
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