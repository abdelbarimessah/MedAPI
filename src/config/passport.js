const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const { jwtSecret } = require('../config/keys');
const User = require('../models/User');
const Prestataire = require('../models/Prestataire');

module.exports = function(passport) {

    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true // To pass `req` for the role to check if it's user or prestataire 
            },
            async (req, email, password, done) => {
                const { role } = req.body; // Extract role from request body
                try {
                    let user;
                    if (role === 'client') {
                        user = await User.findOne({ email });
                    } else if (role === 'prestataire') {
                        user = await Prestataire.findOne({ email });
                    } else {
                        return done(null, false, { message: 'Invalid role specified' });
                    }

                    // Validate password
                    if (!user || !(await bcrypt.compare(password,user.password))) {
                        return done(null, false, { message: 'Invalid credentials' });
                    }

                    // Success: pass user to generate JWT
                    return done(null, user);
                } catch (err) {
                    return done(err);
                }
            }
        )
    );

    const jwtOptions = {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: jwtSecret
    };

    passport.use(new JwtStrategy(jwtOptions, async (jwt_payload, done) => {
        try {
            let user;
    
            // Check the type in the JWT payload to decide which model to query
            if (jwt_payload.role === 'client') {
                user = await User.findById(jwt_payload.id);
            } else if (jwt_payload.role === 'prestataire') {
                user = await Prestataire.findById(jwt_payload.id);
            }
    
            // If user exists, authentication succeeds
            if (user) {
                return done(null, user);
            } else {
                // No user found
                return done(null, false);
            }
        } catch (err) {
            // Handle any errors
            return done(err, false);
        }
    }));





};
