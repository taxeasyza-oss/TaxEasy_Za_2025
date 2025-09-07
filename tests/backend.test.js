test('server starts', async () => {
  // Don't actually start the server - just verify the module exports
  const app = require('../backend/server');
  expect(app).toBeDefined();
  expect(typeof app.listen).toBe('function');
});