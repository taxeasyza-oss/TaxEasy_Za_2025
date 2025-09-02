const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enhanced error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced static file serving with explicit path resolution
const publicPath = path.resolve(__dirname, '../public');
console.log('Public path resolved to:', publicPath);
app.use(express.static(publicPath));

// Root route to serve index.html directly
app.get('/', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    console.log('Serving index.html from:', indexPath);
    res.sendFile(indexPath, (err) => {
        if (err) {
            console.error('Error serving index.html:', err);
            res.status(500).send('Error loading application');
        }
    });
});

// API routes with enhanced logging
app.get('/api/health', (req, res) => {
    console.log('Health check requested');
    res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        message: 'TaxEasy ZA 2025 Server Running',
        publicPath: publicPath,
        environment: process.env.NODE_ENV || 'development'
    });
});

app.get('/api/test', (req, res) => {
    console.log('Test endpoint requested');
    res.json({ 
        message: 'Server is working!',
        timestamp: new Date().toISOString()
    });
});

// Handle tax calculation endpoint
app.post('/api/calculate', (req, res) => {
    try {
        console.log('Tax calculation requested:', req.body);
        const { income, age, deductions } = req.body;

        // Enhanced validation
        if (typeof income !== 'number' || income < 0) {
            return res.status(400).json({ error: 'Invalid income amount' });
        }
        
        if (typeof age !== 'number' || age < 18 || age > 150) {
            return res.status(400).json({ error: 'Invalid age value' });
        }

        if (typeof deductions !== 'number' || deductions < 0) {
            return res.status(400).json({ error: 'Invalid deductions value' });
        }

        // Calculation logic placeholder
        const taxDue = income * 0.18 - deductions;
        
        res.json({
            income,
            age,
            deductions,
            taxDue,
            calculationDate: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Calculation error:', error);
        res.status(500).json({
            error: 'Calculation failed',
            details: error.message
        });
    }
