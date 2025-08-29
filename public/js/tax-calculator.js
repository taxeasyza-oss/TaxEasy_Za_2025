
class TaxCalculator {
  constructor() {
    this.brackets = [
      { min: 0, max: 237100, rate: 0.18, base: 0 },
      { min: 237101, max: 370500, rate: 0.26, base: 42678 },
      { min: 370501, max: 512800, rate: 0.31, base: 77362 },
      { min: 512801, max: 673000, rate: 0.36, base: 121475 },
      { min: 673001, max: 857900, rate: 0.39, base: 179147 },
      { min: 857901, max: 1817000, rate: 0.41, base: 251258 },
      { min: 1817001, max: Infinity, rate: 0.45, base: 644489 }
    ];
    this.rebates = { primary: 17235, secondary: 9444, tertiary: 3145 };
    this.bindEvents();
  }

  bindEvents() {
    ['salary', 'bonus', 'travel', 'solar', 'ra', 'medical', 'age'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', this.calculate);
    });
  }

  calculate = () => {
    const salary = +document.getElementById('salary').value || 0;
    const age = document.getElementById('age').value || 'under-65';
    const ra = Math.min(+document.getElementById('ra').value || 0, salary * 0.275);
    const gross = salary;
    const taxable = Math.max(0, gross - ra);
    const taxBefore = this.brackets.reduce((acc, b) => taxable > b.max ? b.base + (b.max - b.min) * b.rate : acc + Math.max(0, taxable - b.min) * b.rate, 0);
    let rebate = this.rebates.primary;
    if (age === '65-74') rebate += this.rebates.secondary;
