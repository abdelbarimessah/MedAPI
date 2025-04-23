// const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
//   windowMs: 60 * 1000, 
//   max: 5, 
//   message: {
//     error: true,
//     message: 'Too many requests from this IP, please try again after a minute'
//   },
//   standardHeaders: true, 
//   legacyHeaders: false,
// });

// module.exports = {limiter}; 



const rateLimit = require('express-rate-limit'); 
 
// Liste blanche d'IP 
const whitelist = ['127.0.0.1', '192.168.1.1'];  
 
// Middleware de limitation globale 
const globalLimiter = rateLimit({ 
  windowMs: process.env.GLOBAL_RATE_LIMIT_WINDOW_MS || 60 * 1000, // 1 minute par défaut 
  max: process.env.GLOBAL_RATE_LIMIT_MAX || 10, // 5 requêtes par minute par défaut 
  message: { 
    error: true, 
    message: process.env.RATE_LIMIT_MESSAGE || 'Too many requests, please try again later', 
  }, 
  skip: (req) => whitelist.includes(req.ip), 
  handler: (req, res, next, options) => { 
    console.warn(`Rate limit exceeded: IP ${req.ip}`); 
    res.status(options.statusCode).json(options.message); 
  }, 
}); 
 
// Middleware de limitation pour les connexions 
const loginLimiter = rateLimit({ 
  windowMs: process.env.LOGIN_RATE_LIMIT_WINDOW_MS || 60 * 1000, // 1 minute par défaut 
  max: process.env.LOGIN_RATE_LIMIT_MAX || 5,
  message: { 
    error: true, 
    message: 'Too many login attempts, please try again later.', 
  }, 
  handler: (req, res, next, options) => { 
    console.warn(`Login rate limit exceeded: IP ${req.ip}`); 
    res.status(options.statusCode).json(options.message); 
  }, 
}); 
 
module.exports = { 
  globalLimiter, 
  loginLimiter, 
}; 