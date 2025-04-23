const passport = require('passport');


const authMiddleware = {
     ensureAuthenticated (req, res, next){
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err || !user) {
                return res.status(401).json({ message: info ? info.message : 'Please log in to access this resource' });
            }
            req.user = user;
            next();
        })(req, res, next);
    },

    ensureAdmin (req, res, next) {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin role required.' });
        }
        next();
    },

    verifyRole (requiredRole) {
        return (req, res, next) => {
          if (!requiredRole.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied. ${requiredRole} role required.` });
          }
          next();
        };
      }
};

module.exports =authMiddleware;


