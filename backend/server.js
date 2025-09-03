const express = require('express');
const path = require('path');
const cors = require('cors');

const { processPayment } = require('./payfast-service');
const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 3000;

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ---------- Static Files ---------- */
const publicPath = path.resolve(__dirname, '../public');
app.use(express.static(publicPath));

/* ---------- Payment Processing ---------- */
app.post('/api/payments/process', async (req, res) => {
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
