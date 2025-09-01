const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// CRITICAL: Add cookie parser BEFORE any routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // This MUST exist
app.use(cors());

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Basic routes (CSRF disabled for testing)
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Catch all route for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
