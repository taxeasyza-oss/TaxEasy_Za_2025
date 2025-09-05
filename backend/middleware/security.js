// Stub – no real CSRF for now
module.exports = function securityMiddleware() {
  return (req, res, next) => next();
};
