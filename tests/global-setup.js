module.exports = async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.PORT = '3003'; // Different port for tests
};
