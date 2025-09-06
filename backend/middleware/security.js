const helmet = require('helmet');
const csrf = require('csurf');

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

  const csrfProtection = csrf({
    cookie: {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    }
  });

  return [
    helmet(),
    helmet.contentSecurityPolicy(CSP_CONFIG),
    csrfProtection,
    (req, res, next) => {
      res.locals.csrfToken = req.csrfToken();
      next();
    }
  ];
};
