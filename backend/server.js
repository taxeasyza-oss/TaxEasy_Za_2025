const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- Static Files ---------- */
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

/* ---------- SPA Fallback ---------- */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

/* ---------- Health Check ---------- */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'TaxEasy ZA 2025 is running'
  });
});

/* ---------- 404 Handler ---------- */
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

/* ---------- Global Error Handler ---------- */
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

/* ---------- Start Server ---------- */
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

module.exports = app;
