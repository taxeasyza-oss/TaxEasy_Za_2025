/* eslint-disable no-console */
module.exports = class TaxEngine2025 {
  constructor() {
    this.taxBrackets = [
      { min: 0,       max: 237100, rate: 0.18, base: 0 },
      { min: 237101,  max: 370500, rate: 0.26, base: 42678 },
      { min: 370501,  max: 512800, rate: 0.31, base: 77362 },
      { min: 488701,  max: 641400, rate: 0.36, base: 115762 },
      { min: 641401,  max: 817600, rate: 0.39, base: 170734 },
      { min: 817601,  max: 1731600, rate: 0.41, base: 239452 },
      { min: 1731601, max: Infinity, rate: 0.45, base: 614192 }
    ];

    this.thresholds = { under65: 95750, '65-74': 148217, '75+': 165689 };
    this.rebates    = { primary: 17235, secondary: 9444, tertiary: 3145 };
    this.medical    = { main: 364, firstDep: 364, extraDep: 246 };
  }

  calculateTax(grossIncome, ageGroup, deductions) {
    // Calculate total deductible amount
    const totalDed = Math.min(deductions, grossIncome * 0.275); // Ensure deductions don't exceed 27.5% of income
    const taxable   = Math.max(0, grossIncome - totalDed);
    const threshold = this.thresholds[ageGroup] ?? this.thresholds.under65;

    if (taxable <= threshold) {
      return { grossIncome, totalDed, taxable, tax: 0, monthlyTax: 0, effectiveRate: 0, belowThreshold: true };
    }

    let tax = 0;
    for (const b of this.taxBrackets) {
      if (taxable > b.min) {
        const sliceStart = b.min;
        const sliceEnd = Math.min(taxable, b.max);
        const sliceAmount = sliceEnd > sliceStart ? sliceEnd - sliceStart + 1 : 0;
        tax += sliceAmount * b.rate;
      }
    }

    let rebates = this.rebates.primary;
    if (ageGroup === '65-74') rebates += this.rebates.secondary;
    if (ageGroup === '75+')   rebates += this.rebates.secondary + this.rebates.tertiary;

    const medCredits = (d.members * this.medical.main * 12) +
                       (Math.min(d.dependants, 1) * this.medical.firstDep * 12) +
                       (Math.max(0, d.dependants - 1) * this.medical.extraDep * 12);

    const finalTax = Math.max(0, Math.round(tax - rebates - medCredits));
    return {
      grossIncome,
      totalDed,
      taxable,
      tax: finalTax,
      monthlyTax: Math.round(finalTax / 12),
      effectiveRate: +(finalTax / grossIncome * 100).toFixed(2)
    };
  }
}

/* ---------- Global Helper ---------- */
window.taxEngine = new TaxEngine2025();
