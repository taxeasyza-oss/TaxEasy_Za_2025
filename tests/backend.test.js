const { calculateTax } = require('../backend/tax-calculation');

test('server starts', async () => {
  // Verify server module exports
  const app = require('../backend/server');
  expect(app).toBeDefined();
  expect(typeof app.listen).toBe('function');
});

describe('Tax Calculation 2025', () => {
  test('Basic income below threshold (under65)', () => {
    const result = calculateTax({
      ageGroup: 'under65',
      annualIncome: 90000
    });
    expect(result.taxPayable).toBe(0);
  });

  test('Income in first tax bracket', () => {
    const result = calculateTax({
      ageGroup: 'under65',
      annualIncome: 250000
    });
    // Calculation: (250000 - 95750) = 154250 taxable
    // 154250 * 18% = 27765 - 17235 rebate = 10530
    expect(result.taxPayable).toBe(10530);
  });

  test('Income with medical credits and dependents', () => {
    const result = calculateTax({
      annualIncome: 500000,
      medicalAidDependents: 2,
      disability: true
    });
    // Expected medical credits: 4368 + (2*4368) = 13104
    // Disability deduction: 1725
    expect(result.deductions.medical).toBe(13104);
    expect(result.taxPayable).toBe(55761);
  });

  test('Retirement annuity deduction cap', () => {
    const highEarner = calculateTax({
      annualIncome: 1500000,
      retirementFunding: 500000
    });
    // Should cap at 1500000 * 27.5% = 412500 (but max 350000)
    expect(highEarner.deductions.retirementAnnuity).toBe(350000);
  });

  test('Senior citizen rebates (over75)', () => {
    const senior = calculateTax({
      ageGroup: 'over75',
      annualIncome: 200000
    });
    // Rebates: 17235 + 9444 + 3145 = 29824
    expect(senior.rebates).toBe(29824);
  });
});

// TODO: Add more edge cases and verify against SARS documentation