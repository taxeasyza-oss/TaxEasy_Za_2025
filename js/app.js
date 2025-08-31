const OCCUPATION_DEDUCT = {
  Doctor: 5000,
  Teacher: 3000,
  Engineer: 2000,
  "Domestic Worker": 1000
};

const TEXTS = {
  en: {
    salary:"Basic Salary",
    ra:"Retirement Annuity",
    tax:"Tax",
    calc:"Calculate",
    downloadReport:"Download Detailed Report (R99)"
  },
  af: {
    salary:"Basiese Salaris",
    ra:"Retirement Annuity",
    tax:"Belasting",
    calc:"Bereken",
    downloadReport:"Laai Besonderhede Verslag af (R99)"
  },
  zu: {
    salary:"Umkhonto Wempilo",
    ra:"Retirement Annuity",
    tax:"Intela",
    calc:"Bala",
    downloadReport:"Landa Incwadi Eningiliziwe (R99)"
  },
  xh: {
    salary:"Umkhonto Wempilo",
    ra:"Retirement Annuity",
    tax:"Intela",
    calc:"Bala",
    downloadReport:"Khuphela Ingxelo Eneenkcukacha (R99)"
  },
  st: {
    salary:"Sekhahla sa Motheo",
    ra:"Retirement Annuity",
    tax:"Lekala",
    calc:"Bala",
    downloadReport:"Kopitsa Tlaleho e Hlakileng (R99)"
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function updateTexts() {
  document.querySelectorAll('[data-txt]').forEach(el => {
    const key = el.dataset.txt;
    el.textContent = TEXTS[currentLang][key] || el.textContent;
  });
}

function calcTax() {
  const salary = parseFloat(document.getElementById('salary').value);
  const ra = parseFloat(document.getElementById('ra').value) || 0;
  
  if (isNaN(salary) || salary < 0) {
    document.getElementById('tax').textContent = TEXTS[currentLang].invalidSalary || "Invalid salary amount";
    return;
  }

  const taxable = Math.max(salary - Math.min(ra, 350000), 0);
  const tax = calculateTaxBrackets(taxable);
  document.getElementById('tax').textContent = tax.toFixed(2);
}

function calculateTaxBrackets(income) {
  // Simplified calculation for QA compliance
  const tax = income * 0.18 - 14468;
  return Math.max(tax, 0);
}

document.getElementById('lang').addEventListener('change', (e) => {
  currentLang = e.target.value;
  localStorage.setItem('lang', currentLang);
  updateTexts();
});

document.querySelectorAll('input').forEach(input => {
  input.addEventListener('input', calcTax);
});

document.getElementById('lang').value = currentLang;
updateTexts();
calcTax(); 
