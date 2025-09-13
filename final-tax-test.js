const { taxEngine } = require('./backend/server');

console.log('🧮 FINAL SARS 2025 VALIDATION\n');

const testCases = [
    {
        name: "Basic Salary R500,000",
        input: { grossIncome: 500000, ageGroup: 'under65' },
        expected: { taxPayable: 70253, effectiveRate: 14.05 }
    },
    {
        name: "Pensioner R300,000", 
        input: { grossIncome: 300000, ageGroup: '65-74' },
        expected: { rebates: 26679 }
    },
    {
        name: "High Earner R2,000,000",
        input: { grossIncome: 2000000, ageGroup: 'under65' },
        expected: { marginalRate: 45 }
    }
];

let allPassed = true;

testCases.forEach((testCase, index) => {
    console.log(`📊 Test ${index + 1}: ${testCase.name}`);
    try {
        const result = taxEngine.calculateTax(testCase.input);
        
        let passed = true;
        for (const [key, expectedValue] of Object.entries(testCase.expected)) {
            const actualValue = result[key];
            if (Math.abs(actualValue - expectedValue) > 1) {
                passed = false;
                console.log(`  ❌ ${key}: Expected ${expectedValue}, got ${actualValue}`);
            } else {
                console.log(`  ✅ ${key}: ${actualValue}`);
            }
        }
        
        if (passed) {
            console.log(`  🎉 TEST PASSED\n`);
        } else {
            console.log(`  ❌ TEST FAILED\n`);
            allPassed = false;
        }
        
    } catch (error) {
        console.log(`  ❌ ERROR: ${error.message}\n`);
        allPassed = false;
    }
});

console.log(allPassed ? '🎉 ALL TAX CALCULATIONS PASS!' : '❌ Some tests failed');
