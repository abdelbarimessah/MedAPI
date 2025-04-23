const {body, validationResult} = require("express-validator");

const validateRegister = [
    // Validate and sanitize the fields
    body("firstname").notEmpty().withMessage("First name is required").trim(),
    body("lastname").notEmpty().withMessage("Last name is required").trim(),
    body("email").isEmail().withMessage("Invalid email").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
    body("role").isIn(["user", "prestataire"]).withMessage("Role must be either 'user' or 'prestataire'"),
    body("phone").optional().isMobilePhone().withMessage("Invalid phone number"),
    body("specialites").optional().isArray().withMessage("Specialties must be an array"),
    body("tarifs").optional().isArray().withMessage("Tariffs must be an array"),
    body("adresse").optional().trim(),
    body("telephoneProfessionnel").optional().isMobilePhone().withMessage("Invalid professional phone number"),
    body("horairesDisponibilite").optional().isArray().withMessage("horaires must be an array"),
    body("nomEtablissement").optional().trim()
    // Add any additional validations you need for the other fields...
  ];

const validateLogin = [
    // Validate email field
    body("email")
      .isEmail()
      .withMessage("Please provide a valid email address")
      .normalizeEmail(),
    
    // Validate password field
    body("password")
      .notEmpty()
      .withMessage("Password is required"),
  
    // Validate role field (optional, and should be 'user' or 'prestataire')
    body("role")
      .optional()
      .isIn(["user", "prestataire"])
      .withMessage("Role must be either 'user' or 'prestataire'"),
  ];

// Validate the fields for editPrestataire
const validatePrestataire = [
  // Validate 'firstname' field (required and should be a string)
  body('firstname')
    .optional()  // Optional field, only check if it exists
    .isString()
    .withMessage('Firstname must be a string'),

  // Validate 'lastname' field (required and should be a string)
  body('lastname')
    .optional()  // Optional field, only check if it exists
    .isString()
    .withMessage('Lastname must be a string'),

  // Validate 'email' field (required and should be a valid email)
  body('email')
    .optional()  // Optional field, only check if it exists
    .isEmail()
    .withMessage('Email must be a valid email'),

  // Validate 'nomEtablissement' field (optional but should be a string)
  body('nomEtablissement')
    .optional()
    .isString()
    .withMessage('NomEtablissement must be a string'),

  // Validate 'description' field (optional but should be a string)
  body('description')
    .optional()
    .isString()
    .withMessage('Description must be a string'),

  // Validate 'specialites' field (optional but should be an array)
  body('specialites')
    .optional()
    .isArray()
    .withMessage('Specialites must be an array'),

  // Validate 'adresse' field (optional but should be a string)
  body('adresse')
    .optional()
    .isString()
    .withMessage('Adresse must be a string'),

  // Validate 'telephoneProfessionnel' field (optional but should be a string)
  body('telephoneProfessionnel')
    .optional()
    .isString()
    .withMessage('TelephoneProfessionnel must be a string'),

  // Validate 'horairesDisponibilite' field (optional but should be an array)
  body('horairesDisponibilite')
    .optional()
    .isArray()
    .withMessage('HorairesDisponibilite must be an array'),

  // Validate 'tarifs' field (optional but should be an array)
  body('tarifs')
    .optional()
    .isArray()
    .withMessage('Tarifs must be an array')
];
  // Middleware to check validation results
  const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();  // Continue to the next middleware/route handler
  };


const validateAppointement = [
  body('clientName')
    .notEmpty().withMessage('Client name is required')
    .isString().withMessage('Client name must be a string')
    .trim().escape(),
  body('clientEmail')
    .notEmpty().withMessage('Client email is required')
    .isEmail().withMessage('Invalid email address')
    .normalizeEmail(),
  body('clientPhone')
    .notEmpty().withMessage('Client phone is required')
    .isString().withMessage('Client phone must be a string')
    .isMobilePhone().withMessage('Invalid mobile phone number'),
  body('service')
    .notEmpty().withMessage('Service is required')
    .isString().withMessage('Service must be a string')
    .trim().escape(),
  body('date')
    .notEmpty().withMessage('Date is required')
    .isISO8601().withMessage('Invalid date format'),
  body('time')
    .notEmpty().withMessage('Time is required')
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Invalid time format'),
  body('provider')
    .notEmpty().withMessage('Provider is required')
    .isMongoId().withMessage('Invalid provider ID'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a number'),
  (req, res, next) => {
    const errors = validationResult(req);
    console.log('Validation errors:', errors.array());
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next(); 
  }
];

module.exports ={validateAppointement, validateLogin,validateRegister,validatePrestataire,handleValidationErrors};
