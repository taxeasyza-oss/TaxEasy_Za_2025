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

// Test 2: Pensioner R300,000
console.log('📊 Test 2: R300,000 Salary (65-74 years)');
const test2 = taxEngine.calculateTax({
    grossIncome: 300000,
    ageGroup: '65-74',
    retirementFunding: 0,
    medicalAidContributions: 0,
    medicalMembers: 0,
    medicalDependants: 0
});
console.log(`Tax Payable: R${test2.taxPayable.toLocaleString()}`);
console.log(`Rebates: R${test2.rebatesAndCredits.rebates.toLocaleString()}`);
console.log(`Expected Rebates: R26,679 | Result: ${test2.rebatesAndCredits.rebates === 26679 ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 3: Below Threshold
console.log('📊 Test 3: R80,000 Salary (Below Threshold)');
const test3 = taxEngine.calculateTax({
    grossIncome: 80000,
    ageGroup: 'under65',
    retirementFunding: 0,
    medicalAidContributions: 0,
    medicalMembers: 0,
    medicalDependants: 0
});
console.log(`Tax Payable: R${test3.taxPayable.toLocaleString()}`);
console.log(`Below Threshold: ${test3.belowThreshold}`);
console.log(`Expected: R0 | Result: ${test3.taxPayable === 0 ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 4: High Earner R2,000,000
console.log('📊 Test 4: R2,000,000 Salary (Top Tax Bracket)');
const test4 = taxEngine.calculateTax({
    grossIncome: 2000000,
    ageGroup: 'under65',
    retirementFunding: 0,
    medicalAidContributions: 0,
    medicalMembers: 0,
    medicalDependants: 0
});
console.log(`Tax Payable: R${test4.taxPayable.toLocaleString()}`);
console.log(`Marginal Rate: ${test4.marginalRate}%`);
console.log(`Expected: Top bracket (45%) | Result: ${test4.marginalRate === 45 ? '✅ PASS' : '❌ FAIL'}\n`);

// Test 5: With Retirement and Medical
console.log('📊 Test 5: R600,000 with Retirement & Medical');
const test5 = taxEngine.calculateTax({
    grossIncome: 600000,
    ageGroup: 'under65',
    retirementFunding: 100000,
    medicalAidContributions: 24000,
    medicalMembers: 2,
    medicalDependants: 1
});
console.log(`Retirement Deduction: R${test5.deductions.retirement.toLocaleString()}`);
console.log(`Medical Credits: R${test5.rebatesAndCredits.medicalCredits.toLocaleString()}`);
console.log(`Final Tax: R${test5.taxPayable.toLocaleString()}`);
console.log(`Result: ${test5.taxPayable > 0 && test5.taxPayable < 200000 ? '✅ REASONABLE' : '❌ CHECK'}`);

console.log('\n🎯 CALCULATION ACCURACY TEST COMPLETE');