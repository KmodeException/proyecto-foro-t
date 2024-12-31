import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/User.js';

/**
 * Configuración de opciones para la estrategia JWT
 * @type {Object}
 */
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

/**
 * Configuración de la estrategia JWT para Passport
 * Verifica y decodifica el token JWT
 */
passport.use(new JwtStrategy(options, async (jwt_payload, done) => {
    try {
        const user = await User.findById(jwt_payload.id);
        if (user) {
            return done(null, user);
        }
        return done(null, false);
    } catch (error) {
        return done(error, false);
    }
}));

export default passport;
