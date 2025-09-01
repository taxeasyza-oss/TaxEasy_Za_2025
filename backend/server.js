const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// API routes
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        message: 'TaxEasy ZA 2025 Server Running'
    });
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

// Handle tax calculation endpoint
app.post('/api/calculate', (req, res) => {
    try {
        const { income, age, deductions } = req.body;
        
        // Basic validation
        if (!income || isNaN(income) || income < 0) {
            return res.status(400).json({ error: 'Invalid income amount' });
        }

        // Tax calculation would be handled by frontend
        res.json({ message: 'Calculation endpoint ready' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Catch-all handler: send back index.html for any non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 TaxEasy ZA 2025 server running on port ${PORT}`);
    console.log(`📂 Serving static files from: ${path.join(__dirname, '../public')}`);
});

module.exports = app;
