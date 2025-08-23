const helmet = require('helmet');
const { RateLimiterMemory } = require('rate-limiter-flexible');

// Security middleware configuration
const securityMiddleware = (app) => {
  // Set security headers
  app.use(helmet());
  
  // Configure CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  });

  // Rate limiting configuration
  const rateLimiter = new RateLimiterMemory({
    points: 100, // 100 requests
    duration: 60, // per 1 minute per IP
  });

  // Apply rate limiting
  app.use(async (req, res, next) => {
    try {
      await rateLimiter.consume(req.ip);
      next();
    } catch (rejRes) {
      res.status(429).json({
        success: false,
        error: 'Too many requests - please try again later'
      });
    }
  });
};

module.exports = securityMiddleware;