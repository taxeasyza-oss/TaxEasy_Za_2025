const { taxEngine } = require('./backend/server');

console.log('🧮 Quick Tax Validation:');
const result = taxEngine.calculateTax({
    grossIncome: 500000,
    ageGroup: 'under65',
    retirementFunding: 0,
    medicalAidContributions: 0,
    medicalMembers: 0,
    medicalDependants: 0
});

console.log(`Income: R${result.grossIncome.toLocaleString()}`);
console.log(`Tax: R${result.taxPayable.toLocaleString()}`);
console.log(`Rate: ${result.effectiveRate}%`);
console.log(`Result: ${result.taxPayable > 0 ? '✅ WORKING' : '❌ FAILED'}`);
