const express = require('express');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// REQUIRED: Add these middleware in EXACT order
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // MUST come before CSRF
app.use(cors()); // Allow cross-origin requests
app.use(express.static('public')); // Serve frontend files

// Configure CSRF with cookies (simpler for beginners)
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Route to provide CSRF token to frontend
app.get('/api/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Your existing tax calculation endpoint
app.post('/api/calculate-tax', (req, res) => {
  try {
    const taxData = req.body;
    // Add your tax calculation logic here
    res.json({ 
      success: true, 
      taxPayable: 0, // Replace with actual calculation
      csrfToken: req.csrfToken() 
    });
  } catch (error) {
    res.status(500).json({ error: 'Calculation error' });
  }
});

// Serve the main page
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
