const express = require('express');
const cors = require('cors');
const { calculateTax } = require('./tax-calculation');
const securityMiddleware = require('./middleware/security');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(express.json());
app.use(cors());

// Apply security middleware
securityMiddleware(app);

// Input validation for tax calculation
const validateTaxInput = [
  body('annualIncome').isFloat({ min: 0 }),
  body('retirementFunding').isFloat({ min: 0 }),
  body('occupationType').isIn(['medical', 'general']),
  body('occupationDeductions').isFloat({ min: 0 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// API endpoint with validation
app.post('/api/calculate-tax', validateTaxInput, (req, res) => {
  try {
    const result = calculateTax(req.body);
    res.json(result);
  } catch (error) {
    console.error('Tax calculation error:', error);
    res.status(500).json({ error: 'Tax calculation failed' });
  }
});

// Existing routes from app.py converted to Express
app.get('/health', (req, res) => res.send('OK'));
app.use(express.static('../public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});