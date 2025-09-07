/* ---------- 0. Imports ---------- */
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { csrf } = require('csrf-csrf');   // NEW – csrf-csrf 4.x factory
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- 1. Security & utility middleware ---------- */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- 2. Static assets – NEW ORDER ---------- */
const rootPath   = path.resolve(__dirname, '..');           // project root
const publicPath = path.resolve(__dirname, '../public');    // bundled assets
const guidesPath = path.resolve(__dirname, '../efiling-guides');

// 2a. Root-level standalone pages (html extension optional)
app.use(express.static(rootPath, { extensions: ['html'] }));

// 2b. Public folder (CSS, JS, images, translations, etc.)
app.use(express.static(publicPath));

// 2c. Multi-language guides folder
app.use('/efiling-guides', express.static(guidesPath));

/* ---------- 3. CSRF protection (factory call) ---------- */
app.use(csrf());   // ← factory call – returns middleware

/* ---------- 4. API routes ---------- */
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
app.post('/api/payments/process', (req, res) => {
  res.json({ success: true, stub: true });
});

/* ---------- 5. SPA fallback – only for true SPA routes ---------- */
const RESERVED = ['/api', '/efiling-guides', '/faq', '/payment-', '/public', '/translations'];
app.get('*', (req, res, next) => {
  if (RESERVED.some(r => req.path.startsWith(r))) return next();
  res.sendFile(path.join(rootPath, 'index.html'));
});

/* ---------- 6. Global 404 ---------- */
app.use((req, res) => res.status(404).json({ error: 'Not found' }));

/* ---------- 7. Start server ---------- */
app.listen(PORT, () => console.log(`🚀 TaxEasy ZA 2025 listening on port ${PORT}`));
module.exports = app;
