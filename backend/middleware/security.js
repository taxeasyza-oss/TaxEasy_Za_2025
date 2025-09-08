const helmet = require('helmet');
const { doubleCsrf } = require('csrf-csrf');

const {
  generateToken,
  doubleCsrfProtection
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'fallback-secret-change-in-prod',
  cookieName: '__Host-psifi.x-csrf-token',
  cookieOptions: {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production'
  }
});

const CSP_CONFIG = {
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "cdn.payfast.co.za"],
    styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
    imgSrc: ["'self'", "data:", "cdn.payfast.co.za"],
    fontSrc: ["'self'", "fonts.gstatic.com"],
    connectSrc: ["'self'", "api.payfast.co.za"],
    formAction: ["'self'", "secure.payfast.co.za"]
  }
};

module.exports = function securityHeaders() {
  const CSP_CONFIG = {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "cdn.payfast.co.za"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      imgSrc: ["'self'", "data:", "cdn.payfast.co.za"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      connectSrc: ["'self'", "api.payfast.co.za"],
      formAction: ["'self'", "secure.payfast.co.za"]
    }
  };

  // Custom CSRF middleware to exclude static assets and API endpoints
  const csrfProtection = (req, res, next) => {
    if (req.method === 'GET' ||
        req.path.startsWith("/payfast/callback") ||
        req.path.startsWith("/css/") ||
        req.path.startsWith("/js/") ||
        req.path.startsWith("/images/")) {
      return next();
    }
    csrf({
      cookie: {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
      }
    })(req, res, next);
  };

  return [
    helmet(),
    helmet.contentSecurityPolicy(CSP_CONFIG),
    csrfProtection,
    (req, res, next) => {
      res.locals.csrfToken = req.csrfToken?.() || generateToken(res);
      next();
    }
  ];
};
