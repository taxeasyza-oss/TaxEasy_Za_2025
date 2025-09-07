test('server starts', async () => {
  const app = require('../backend/server');
  expect(app).toBeDefined();
});