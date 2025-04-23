const requiredEnvVars = {
    // Server
    PORT: process.env.PORT,
    DB_URI: process.env.DB_URI,
    
    // Authentication
    JWT_SECRET: process.env.JWT_SECRET,
    SESSION_SECRET: process.env.SESSION_SECRET,
    
    // Google OAuth
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    
    // Email Service
    EMAIL_SERVICE: process.env.EMAIL_SERVICE,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
    
    // Frontend URL (for email links)
    FRONTEND_URL: process.env.FRONTEND_URL,

    // check the type of the env variables
    NODE_ENV : process.env.NODE_ENV,

    // for the ratelimiter
    GLOBAL_RATE_LIMIT_WINDOW_MS : process.env.GLOBAL_RATE_LIMIT_WINDOW_MS,
    GLOBAL_RATE_LIMIT_MAX : process.env.GLOBAL_RATE_LIMIT_MAX,
    LOGIN_RATE_LIMIT_WINDOW_MS : process.env.LOGIN_RATE_LIMIT_WINDOW_MS,
    LOGIN_RATE_LIMIT_MAX : process.env.LOGIN_RATE_LIMIT_MAX,

  };
  
  function validateEnv() {
    
    const missingVars = [];
    
    for (const [key, value] of Object.entries(requiredEnvVars)) {
      if (!value) {
        missingVars.push(key);
      }
    }
    
    if (missingVars.length > 0) {
      console.error('❌ Required environment variables are missing:');
      console.error(missingVars.join(', '));
      console.error('\nPlease check your .env file');
      process.exit(1);
    }
    
    return requiredEnvVars;
  }
  
  module.exports = validateEnv();