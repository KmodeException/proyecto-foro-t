export const roleCheck = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'No tienes permisos suficientes'
            });
        }
        next();
    };
};

export const isTranslator = (req, res, next) => {
    if (!req.user.translatorProfile || !['translator', 'admin'].includes(req.user.role)) {
        return res.status(403).json({
            message: 'Requiere perfil de traductor'
        });
    }
    next();
};

export const checkTranslatorLevel = (minLevel) => {
    return (req, res, next) => {
        if (req.user.translatorProfile.level < minLevel) {
            return res.status(403).json({
                message: `Requiere nivel ${minLevel} de traductor`
            });
        }
        next();
    };
};