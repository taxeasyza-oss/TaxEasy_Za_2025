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
  body('annualIncome')
    .isFloat({ min: 0, max: 1500000 }).withMessage('invalid_income_range')
    .toFloat(),
  body('retirementFunding')
    .isFloat({ min: 0 })
    .custom((value, { req }) => value <= req.body.annualIncome * 0.275)
    .withMessage('retirement_contribution_limit'),
  body('occupationType')
    .isIn(['medical', 'general']).withMessage('invalid_occupation_type'),
  body('occupationDeductions')
    .isFloat({ min: 0 })
    .custom((value, { req }) => {
      if (req.body.occupationType === 'medical') {
        return value <= req.body.annualIncome * 0.15;
      }
      return value <= req.body.annualIncome * 0.10;
    }).withMessage('excessive_occupation_deductions'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array().map(err => ({
          param: err.param,
          msg: req.t(err.msg) // Use localization
        }))
      });
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
app.use(express.static(process.env.STATIC_DIR || '../public'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});