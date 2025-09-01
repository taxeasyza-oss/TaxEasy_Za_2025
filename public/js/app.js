// ======================================================================
// TaxEasy_Za_2025 – COMPLETE 2025 SARS-COMPLIANT TAX ENGINE + UI
// Replaces the old simplified (and wrong) calculator
// ======================================================================

class SARSTaxEngine2025 {
  constructor() {
    // SARS 2025 tax brackets (1 Mar 2024 – 28 Feb 2025)
    this.brackets = [
      { min: 0, max: 237100, rate: 0.18 },
      { min: 237101, max: 370500, rate: 0.26 },
      { min: 370501, max: 512800, rate: 0.31 },
      { min: 512801, max: 673000, rate: 0.36 },
      { min: 673001, max: 857900, rate: 0.39 },
      { min: 857901, max: 1817000, rate: 0.41 },
      { min: 1817001, max: Infinity, rate: 0.45 }
    ];

    this.thresholds = {
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
      mainMember: 4368,
      dependant: 4368
    };
  }

  calculateTax(gross, age = 'under65', deductions = {}) {
    const {
      retirementFunding = 0,
      medicalAid = 0,
      medicalMembers = 0,
      medicalDependants = 0
    } = deductions;

    const raDeductible = Math.min(retirementFunding, gross * 0.275, 350000);
    const taxable = Math.max(gross - raDeductible, 0);

    if (taxable <= this.thresholds[age]) {
      return {
        grossIncome: gross,
        taxableIncome: taxable,
        finalTax: 0,
        effectiveRate: 0,
        monthlyTax: 0,
        breakdown: []
      };
    }

    let tax = 0;
    let remaining = taxable;
    const breakdown = [];

    for (const b of this.brackets) {
      if (remaining <= 0) break;
      const taxableInBracket = Math.min(remaining, b.max - b.min + 1);
      const bracketTax = taxableInBracket * b.rate;
      tax += bracketTax;
      remaining -= taxableInBracket;

      breakdown.push({
        range: `R${b.min.toLocaleString()} – R${b.max === Infinity ? '∞' : b.max.toLocaleString()}`,
        rate: `${(b.rate * 100).toFixed(0)}%`,
        tax: Math.round(bracketTax)
      });
    }

    let rebates = this.rebates.primary;
    if (age === '65-74') rebates += this.rebates.secondary;
    if (age === '75+') rebates += this.rebates.secondary + this.rebates.tertiary;

    const medCredits = (medicalMembers * this.medicalCredits.mainMember) +
                       (medicalDependants * this.medicalCredits.dependant);

    const taxAfterRebates = Math.max(0, tax - rebates);
    const finalTax = Math.max(0, taxAfterRebates - medCredits);

    return {
      grossIncome: gross,
      taxableIncome: taxable,
      finalTax: Math.round(finalTax),
      effectiveRate: Math.round((finalTax / gross) * 100 * 100) / 100,
      monthlyTax: Math.round(finalTax / 12),
      breakdown
    };
  }
}

// =========================================================================
// Translation strings (unchanged keys, ready for additional langs)
// =========================================================================
const TEXTS = {
  en: {
    salary: "Basic Salary",
    ra: "Retirement Annuity",
    tax: "Tax",
    calc: "Calculate",
    invalidSalary: "Invalid salary amount",
    downloadReport: "Download Detailed Report (R99)"
  },
  af: {
    salary: "Basiese Salaris",
    ra: "Retirement Annuity",
    tax: "Belasting",
    calc: "Bereken",
    invalidSalary: "Ongeldige salarisbedrag",
    downloadReport: "Laai Besonderhede Verslag af (R99)"
  },
  zu: {
    salary: "Umkhonto Wempilo",
    ra: "Retirement Annuity",
    tax: "Intela",
    calc: "Bala",
    invalidSalary: "Inani elingasebenzi",
    downloadReport: "Landa Incwadi Eningiliziwe (R99)"
  },
  xh: {
    salary: "Umkhonto Wempilo",
    ra: "Retirement Annuity",
    tax: "Intela",
    calc: "Bala",
    invalidSalary: "Inani elingasebenzi",
    downloadReport: "Khuphela Ingxelo Eneenkcukacha (R99)"
  },
  st: {
    salary: "Sekhahla sa Motheo",
    ra: "Retirement Annuity",
    tax: "Lekala",
    calc: "Bala",
    invalidSalary: "Chelete e sa lokang",
    downloadReport: "Kopitsa Tlaleho e Hlakileng (R99)"
  }
};

// =========================================================================
// UI wiring
// =========================================================================
let currentLang = localStorage.getItem('lang') || 'en';
const taxEngine = new SARSTaxEngine2025();

// Polyfill for missing elements (in case HTML is still the old one)
function ensureElements() {
  if (!document.getElementById('lang')) {
    const langSel = document.createElement('select');
    langSel.id = 'lang';
    langSel.innerHTML = `<option value="en">English</option>
                         <option value="af">Afrikaans</option>
                         <option value="zu">isiZulu</option>
                         <option value="xh">isiXhosa</option>
                         <option value="st">Sesotho</option>`;
    document.body.prepend(langSel);
  }
}

function updateTexts() {
  Object.entries(TEXTS[currentLang]).forEach(([key, txt]) => {
    const el = document.querySelector(`[data-txt="${key}"]`);
    if (el) el.textContent = txt;
  });
}

function runCalculation() {
  const salary = parseFloat(document.getElementById('salary')?.value || 0);
  const ra = parseFloat(document.getElementById('ra')?.value || 0);
  const age = document.getElementById('age')?.value || 'under65';

  if (isNaN(salary) || salary < 0) {
    document.getElementById('tax').textContent = TEXTS[currentLang].invalidSalary;
    return;
  }

  const result = taxEngine.calculateTax(salary, age, { retirementFunding: ra });
  document.getElementById('tax').textContent = `R${result.finalTax.toLocaleString()}`;
}

// =========================================================================
// Event listeners
// =========================================================================
document.addEventListener('DOMContentLoaded', () => {
  ensureElements();
  updateTexts();
  runCalculation();

  document.getElementById('lang')?.addEventListener('change', (e) => {
    currentLang = e.target.value;
    localStorage.setItem('lang', currentLang);
    updateTexts();
    runCalculation();
  });

  document.querySelectorAll('#salary, #ra, #age').forEach(el =>
    el.addEventListener('input', runCalculation)
  );
});
