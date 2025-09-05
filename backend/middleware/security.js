const helmet = require('helmet');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { doubleCsrf } = require('csrf-csrf');

// Configure CSRF protection with v4+ syntax
const { invalidCsrfTokenError, generateToken } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'taxeasy-za-2025-default-secret',
  cookieOptions: {
    name: '_csrf',
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 86400
  },
  getSecret: () => process.env.CSRF_SECRET || 'taxeasy-za-2025-default-secret',
  getTokenFromRequest: (req) => req.headers['x-csrf-token']
});

// Security middleware configuration
const securityMiddleware = (app) => {
  // CSRF protection
  // CSRF protection with csrf-csrf
  app.use((req, res, next) => {
    const csrfToken = generateToken(res);
    res.cookie('XSRF-TOKEN', csrfToken, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'strict'
    });
    next();
  });

  // Content Security Policy
  app.use(helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "https://cdn.tailwindcss.com"],
      scriptSrc: ["'self'", "https://cdn.payfast.co.za"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", "https://api.taxeasy.za"],
      scriptSrc: ["'self'", "https://cdn.payfast.co.za"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"]
    }
  }));

  // Additional security headers
  app.use(helmet.frameguard({ action: 'deny' }));
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