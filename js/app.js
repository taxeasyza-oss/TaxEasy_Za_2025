const TEXTS = {
  en: { salary:"Basic Salary", ra:"Retirement Annuity", tax:"Tax", calc:"Calculate" },
  af: { salary:"Basiese Salaris", ra:"Retirement Annuity", tax:"Belasting", calc:"Bereken" },
  zu: { salary:"Umkhonto Wempilo", ra:"Retirement Annuity", tax:"Intela", calc:"Bala" },
  xh: { salary:"Umkhonto Wempilo", ra:"Retirement Annuity", tax:"Intela", calc:"Bala" },
  st: { salary:"Sekhahla sa Motheo", ra:"Retirement Annuity", tax:"Lekala", calc:"Bala" }
};

let currentLang = localStorage.getItem('lang') || 'en';

function updateTexts() {
  document.querySelectorAll('[data-txt]').forEach(el => {
    const key = el.dataset.txt;
    el.textContent = TEXTS[currentLang][key] || el.textContent;
  });
}

function calcTax() {
  const salary = parseFloat(document.getElementById('salary').value) || 0;
  const ra = parseFloat(document.getElementById('ra').value) || 0;
  const taxable = Math.max(salary - Math.min(ra, 350000), 0);
  const tax = calculateTaxBrackets(taxable);
  document.getElementById('tax').textContent = tax.toFixed(2);
}

function calculateTaxBrackets(income) {
  const brackets = [
    { limit: 237100, rate: 0.18 },
    { limit: 370500, rate: 0.26 },
    { limit: 512800, rate: 0.31 },
    { limit: 673000, rate: 0.36 },
    { limit: 857900, rate: 0.39 },
    { limit: Infinity, rate: 0.45 }
  ];

  let tax = 0;
  let previousLimit = 0;
  
  for (const bracket of brackets) {
    if (income > previousLimit) {
      const taxableAmount = Math.min(income - previousLimit, bracket.limit - previousLimit);
      tax += taxableAmount * bracket.rate;
      previousLimit = bracket.limit;
    }
  }
  
  return tax - 17235;
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
