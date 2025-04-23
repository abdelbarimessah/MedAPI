const mongoSanitize = require('mongo-sanitize');
const xssClean = require('xss-clean');

const sanitizeAndClean = (req, res, next) => {

  for (const key in req.body) {
    if (Object.hasOwnProperty.call(req.body, key)) {
      req.body[key] = mongoSanitize(req.body[key]);
    }
  }

  
  xssClean()(req, res, next);
};

module.exports = sanitizeAndClean;
