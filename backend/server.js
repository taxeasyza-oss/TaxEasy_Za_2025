const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- Rate Limiting ---------- */
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later'
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many payment attempts, please try again later'
});

/* ---------- Middleware ---------- */
const compression = require('compression');
const { securityHeaders } = require('./middleware/security');

app.use(helmet());
app.use(...securityHeaders());
app.use(compression());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ?
    process.env.ALLOWED_ORIGINS.split(',') : [
    'https://taxeasy-za-2025.onrender.com',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  maxAge: 86400,
  preflightContinue: false
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- Static Files ---------- */
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath, {
  setHeaders: (res, path) => {
    if (express.static.mime.lookup(path) === 'text/html') {
      res.set('Cache-Control', 'public, max-age=0');
    } else {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

/* ---------- Payment Processing ---------- */
const payfastService = require('./payfast-service');

app.post('/api/payments/process', paymentLimiter, async (req, res) => {
  try {
    const { amount, description, userEmail } = req.body;
    
    if (!amount || !description || !userEmail) {
      logger.warn('Invalid payment request', { request: req.body });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const paymentResult = await processPayment({
      amount,
      description,
      email: userEmail
    });

    logger.info('Payment processed successfully', {
      paymentId: paymentResult.paymentId,
      amount,
      userEmail
    });

    res.json({
      success: true,
      paymentId: paymentResult.paymentId,
      redirectUrl: paymentResult.redirectUrl
    });

  } catch (error) {
    logger.error('Payment processing failed', {
      error: error.message,
      stack: error.stack
    });
    res.status(500).json({
      error: 'Payment processing failed',
      details: error.message
    });
  }
});

/* ---------- SPA Fallback ---------- */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

/* ---------- Health Check ---------- */
app.get('/api/health', (req, res) => {
  // Explicitly set cache-control headers for health check
  res.set('Cache-Control', 'no-store, max-age=0');
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    message: 'TaxEasy ZA 2025 is running'
  });
});

/* ---------- 404 Handler ---------- */
app.use('*', (req, res) => {
  if (req.accepts('html')) {
    return res.status(404).sendFile(path.join(publicPath, '404.html'));
  }
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
