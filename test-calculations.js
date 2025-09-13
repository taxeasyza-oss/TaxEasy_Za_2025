const { taxEngine } = require('./backend/server');

console.log('🧮 SARS 2025 CALCULATION ACCURACY TEST\n');

// Test 1: Basic Salary R500,000
console.log('📊 Test 1: R500,000 Salary (Under 65)');
const test1 = taxEngine.calculateTax({
    grossIncome: 500000,
    ageGroup: 'under65',
    retirementFunding: 0,
    medicalAidContributions: 0,
    medicalMembers: 0,
    medicalDependants: 0
});
console.log(`Gross Income: R${test1.grossIncome.toLocaleString()}`);
console.log(`Taxable Income: R${test1.taxableIncome.toLocaleString()}`);
console.log(`Tax Payable: R${test1.taxPayable.toLocaleString()}`);
console.log(`Effective Rate: ${test1.effectiveRate}%`);
console.log(`Expected: ~R70,253 | Result: ${test1.taxPayable === 70253 ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 2: With Retirement and Medical
console.log('📊 Test 2: R600,000 with Retirement & Medical');
const test2 = taxEngine.calculateTax({
    grossIncome: 600000,
    ageGroup: 'under65',
    retirementFunding: 100000,
    medicalAidContributions: 24000,
    medicalMembers: 2,
    medicalDependants: 1
});
console.log(`Retirement Deduction: R${test2.deductions.retirement.toLocaleString()}`);
console.log(`Medical Credits: R${test2.rebatesAndCredits.medicalCredits.toLocaleString()}`);
console.log(`Final Tax: R${test2.taxPayable.toLocaleString()}`);
console.log(`Result: ${test2.taxPayable > 0 && test2.taxPayable < 200000 ? '✅ REASONABLE' : '❌ CHECK'}`);

console.log('\n🎯 CALCULATION ACCURACY TEST COMPLETE');
