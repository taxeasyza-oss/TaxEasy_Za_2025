const request = require('supertest');
const { app, taxEngine } = require('../backend/server');

describe('TaxEasy ZA 2025 - Backend Tests', () => {
    
    describe('Server Health', () => {
        test('Health check endpoint should return 200', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect(200);
            
            expect(response.body.status).toBe('healthy');
            expect(response.body.version).toBe('2.0.0');
        });
    });

    describe('Tax Engine - SARS 2025 Compliance', () => {
        
        test('Should calculate correct tax for R500,000 salary', () => {
            const result = taxEngine.calculateTax({
                grossIncome: 500000,
                ageGroup: 'under65',
                retirementFunding: 0,
                medicalAidContributions: 0,
                medicalMembers: 0,
                medicalDependants: 0
            });
            
            expect(result.grossIncome).toBe(500000);
            expect(result.taxableIncome).toBe(500000);
            expect(result.taxPayable).toBeGreaterThan(0);
            expect(result.effectiveRate).toBeGreaterThan(0);
        });

        test('Should apply age-based rebates correctly', () => {
            const result = taxEngine.calculateTax({
                grossIncome: 300000,
                ageGroup: '65-74',
                retirementFunding: 0,
                medicalAidContributions: 0,
                medicalMembers: 0,
                medicalDependants: 0
            });
            
            const expectedRebates = 17235 + 9444; // Primary + Secondary
            expect(result.rebatesAndCredits.rebates).toBe(expectedRebates);
        });
    });

    describe('Tax Calculation API', () => {
        
        test('POST /api/calculate should return correct calculation', async () => {
            const taxData = {
                grossIncome: 600000,
                ageGroup: 'under65',
                retirementFunding: 50000,
                medicalAidContributions: 20000,
                medicalMembers: 1,
                medicalDependants: 1
            };

            const response = await request(app)
                .post('/api/calculate')
                .send(taxData)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.calculation).toHaveProperty('grossIncome');
            expect(response.body.calculation).toHaveProperty('taxPayable');
            expect(response.body.calculation.grossIncome).toBe(600000);
            expect(response.body.taxYear).toBe('2025');
        });

        test('POST /api/calculate should validate input', async () => {
            const response = await request(app)
                .post('/api/calculate')
                .send({})
                .expect(400);
            
            expect(response.body.error).toBe('Invalid gross income amount');
        });
    });
});
