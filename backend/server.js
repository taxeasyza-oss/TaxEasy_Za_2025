/* ==========================================
   PRODUCTION SERVER - TaxEasy_Za_2025
   Enterprise-grade Express.js server
   ========================================== */

const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// ==========================================
// SECURITY & PERFORMANCE MIDDLEWARE
// ==========================================

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:"],
        }
    }
}));

app.use(compression());
app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || '*' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Enhanced input validation middleware
const validateTaxInput = (req, res, next) => {
  const { grossIncome, ageGroup, medicalMembers, medicalDependants } = req.body;
  
  const errors = [];
  
  // Income validation
  if (!grossIncome || grossIncome < 0 || grossIncome > 50000000) {
    errors.push('Gross income must be between R0 and R50,000,000');
  }
  
  // Age group validation
  const validAgeGroups = ['under65', '65-74', '75+'];
  if (ageGroup && !validAgeGroups.includes(ageGroup)) {
    errors.push('Age group must be: under65, 65-74, or 75+');
  }
  
  // Medical validation
  if (medicalMembers < 0 || medicalMembers > 10) {
    errors.push('Medical members must be between 0 and 10');
  }
  
  if (medicalDependants < 0 || medicalDependants > 20) {
    errors.push('Medical dependants must be between 0 and 20');
  }
  
  if (errors.length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors,
      timestamp: new Date().toISOString()
    });
  }
  
  next();
};
// ==========================================
// TAX CALCULATION ENGINE
// ==========================================

class SARSTaxEngine2025 {
    constructor() {
        this.taxBrackets = [
            { min: 0, max: 237100, rate: 0.18, base: 0 },
            { min: 237101, max: 370500, rate: 0.26, base: 42678 },
            { min: 370501, max: 512800, rate: 0.31, base: 77362 },
            { min: 512801, max: 673000, rate: 0.36, base: 121476 },
            { min: 673001, max: 857900, rate: 0.39, base: 179147 },
            { min: 857901, max: 1817000, rate: 0.41, base: 251258 },
            { min: 1817001, max: Infinity, rate: 0.45, base: 644490 }
        ];

        this.taxThresholds = {
            'under65': 95750,
            '65-74': 148217,
            '75+': 165689
        };

        this.rebates = {
            primary: 17235,
            secondary: 9444,
            tertiary: 3145
        };

        this.medicalCredits = {
            mainMember: 4368,     // R364 × 12 months
            dependant: 4368      // R364 × 12 months
        };
    }

    calculateTax(taxData) {
        try {
            const {
                grossIncome = 0,
                ageGroup = 'under65',
                retirementFunding = 0,
                medicalAidContributions = 0,
                medicalMembers = 0,
                medicalDependants = 0
            } = taxData;

            if (grossIncome < 0) {
                throw new Error('Gross income cannot be negative');
            }

            // Calculate retirement deduction (max 27.5% of income or R350,000)
            const maxRetirementDeduction = Math.min(grossIncome * 0.275, 350000);
            const retirementDeduction = Math.min(retirementFunding, maxRetirementDeduction);

            // Calculate taxable income
            const taxableIncome = Math.max(0, grossIncome - retirementDeduction);

            // Check if below tax threshold
            const threshold = this.taxThresholds[ageGroup] || this.taxThresholds['under65'];
            if (taxableIncome <= threshold) {
                return this.createBelowThresholdResult(taxData, grossIncome, retirementDeduction, taxableIncome, threshold);
            }

            // Calculate tax using brackets
            const taxCalculation = this.calculateTaxFromBrackets(taxableIncome);
            
            // Apply rebates and credits
            const rebatesAndCredits = this.calculateRebatesAndCredits(taxData);
            
            // Calculate final tax
            const finalTax = Math.max(0, taxCalculation.tax - rebatesAndCredits.total);
            
            return this.createTaxResult(taxData, grossIncome, retirementDeduction, taxableIncome, taxCalculation, rebatesAndCredits, finalTax);

        } catch (error) {
            console.error('Tax calculation error:', error);
            throw new Error(`Tax calculation failed: ${error.message}`);
        }
    }

    calculateTaxFromBrackets(taxableIncome) {
        let tax = 0;
        const bracketBreakdown = [];

        for (const bracket of this.taxBrackets) {
            if (taxableIncome > bracket.min) {
                const taxableInBracket = Math.min(
                    taxableIncome - bracket.min,
                    bracket.max === Infinity ? taxableIncome - bracket.min : bracket.max - bracket.min
                );
                
                if (taxableInBracket > 0) {
                    const bracketTax = bracket.base + (taxableInBracket * bracket.rate);
                    tax += bracketTax;

                    bracketBreakdown.push({
                        range: `R${bracket.min.toLocaleString()} - ${bracket.max === Infinity ? '∞' : 'R' + bracket.max.toLocaleString()}`,
                        rate: `${(bracket.rate * 100).toFixed(0)}%`,
                        taxableAmount: Math.round(taxableInBracket),
                        tax: Math.round(bracketTax)
                    });
                }
            }
        }

        return { tax, bracketBreakdown };
    }

    calculateRebatesAndCredits(data) {
        // Calculate rebates based on age
        let totalRebates = this.rebates.primary;
        
        if (data.ageGroup === '65-74') {
            totalRebates += this.rebates.secondary;
        } else if (data.ageGroup === '75+') {
            totalRebates += this.rebates.secondary + this.rebates.tertiary;
        }

        // Calculate medical aid tax credits
        const memberCredits = data.medicalMembers * this.medicalCredits.mainMember;
        const dependantCredits = data.medicalDependants * this.medicalCredits.dependant;
        const totalMedicalCredits = memberCredits + dependantCredits;

        return {
            rebates: totalRebates,
            medicalCredits: totalMedicalCredits,
            total: totalRebates + totalMedicalCredits
        };
    }

    createBelowThresholdResult(data, grossIncome, retirementDeduction, taxableIncome, threshold) {
        const rebatesAndCredits = this.calculateRebatesAndCredits(data);
        
        return {
            grossIncome: Math.round(grossIncome),
            taxableIncome: Math.round(taxableIncome),
            taxPayable: 0,
            monthlyTax: 0,
            effectiveRate: 0,
            netIncome: Math.round(grossIncome),
            deductions: { retirement: retirementDeduction, total: retirementDeduction },
            rebatesAndCredits: rebatesAndCredits,
            bracketBreakdown: [],
            belowThreshold: true,
            threshold: threshold,
            taxYear: '2025',
            calculatedAt: new Date().toISOString()
        };
    }

    createTaxResult(data, grossIncome, retirementDeduction, taxableIncome, taxCalculation, rebatesAndCredits, finalTax) {
        const effectiveRate = grossIncome > 0 ? (finalTax / grossIncome) * 100 : 0;
        const marginalRate = this.getMarginalRate(taxableIncome);
        const netIncome = grossIncome - finalTax;

        return {
            grossIncome: Math.round(grossIncome),
            taxableIncome: Math.round(taxableIncome),
            taxPayable: Math.round(finalTax),
            monthlyTax: Math.round(finalTax / 12),
            effectiveRate: Number(effectiveRate.toFixed(2)),
            marginalRate: marginalRate,
            netIncome: Math.round(netIncome),
            deductions: { retirement: retirementDeduction, total: retirementDeduction },
            rebatesAndCredits: rebatesAndCredits,
            bracketBreakdown: taxCalculation.bracketBreakdown,
            belowThreshold: false,
            threshold: this.getThreshold(data.ageGroup),
            taxYear: '2025',
            calculatedAt: new Date().toISOString(),
            summary: {
                totalIncome: Math.round(grossIncome),
                totalTax: Math.round(finalTax),
                netPayAfterTax: Math.round(netIncome)
            }
        };
    }

    getMarginalRate(taxableIncome) {
        for (const bracket of this.taxBrackets) {
            if (taxableIncome >= bracket.min && (bracket.max === Infinity || taxableIncome <= bracket.max)) {
                return Number((bracket.rate * 100).toFixed(0));
            }
        }
        return 0;
    }

    getThreshold(ageGroup) {
        return this.taxThresholds[ageGroup] || this.taxThresholds['under65'];
    }
}

// ==========================================
// CREATE GLOBAL TAX ENGINE INSTANCE
// ==========================================

const taxEngine = new SARSTaxEngine2025();

// ==========================================
// API ROUTES
// ==========================================

app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '2.0.0',
        environment: process.env.NODE_ENV || 'development',
        uptime: process.uptime()
    });
});

app.post('/api/calculate', validateTaxInput, (req, res) => {
    try {
        const taxData = req.body;

        // Calculate tax
        const result = taxEngine.calculateTax(taxData);
        
        res.json({
            success: true,
            calculation: result,
            calculatedAt: new Date().toISOString(),
            taxYear: '2025'
        });

    } catch (error) {
        console.error('Tax calculation error:', error);
        res.status(500).json({
            error: 'Tax calculation failed',
            details: error.message
        });
    }
});

// ==========================================
// STATIC FILES & ROUTING
// ==========================================

const rootPath = path.resolve(__dirname, '..');
const publicPath = path.resolve(__dirname, '../public');

app.use(express.static(rootPath, { extensions: ['html'] }));
app.use(express.static(publicPath));

const RESERVED_PATHS = ['/api', '/efiling-guides', '/faq', '/payment-', '/public'];

app.get('*', (req, res, next) => {
    if (RESERVED_PATHS.some(reserved => req.path.startsWith(reserved))) return next();
    res.sendFile(path.join(rootPath, 'index.html'));
});

// ==========================================
// ERROR HANDLING
// ==========================================

app.use((req, res) => res.status(404).json({ error: 'Not found' }));

app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// ==========================================
// START SERVER
// ==========================================

if (require.main === module) {
    const server = app.listen(PORT, () => {
        console.log(`🚀 TaxEasy ZA 2025 server running on port ${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`✅ Ready for tax calculations!`);
    });
}

// ==========================================
// EXPORTS FOR TESTING
// ==========================================

module.exports = { app, taxEngine };
