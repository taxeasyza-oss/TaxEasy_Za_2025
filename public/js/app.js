const TEXTS = {
  en: { salary:"Basic Salary", ra:"Retirement Annuity", travel:"Travel Allowance (km)", solar:"Solar §12B", tax:"Tax" },
  af: { salary:"Basiese Salaris", ra:"Retirement Annuity", travel:"Reis Toelaag (km)", solar:"Solar §12B", tax:"Belasting" },
  zu: { salary:"Umkhonto Wempilo", ra:"Retirement Annuity", travel:"Ukuhamba (km)", solar:"Solar §12B", tax:"Intela" },
  xh: { salary:"Umkhonto Wempilo", ra:"Retirement Annuity", travel:"Ukuhamba (km)", solar:"Solar §12B", tax:"Intela" },
  st: { salary:"Sekhahla sa Motheo", ra:"Retirement Annuity", travel:"Ho Tsamaya (km)", solar:"Solar §12B", tax:"Lekala" }
};

function changeLang(lang){
  localStorage.setItem('lang', lang);
  document.querySelectorAll('[data-txt]').forEach(el=>{
    el.textContent = TEXTS[lang][el.dataset.txt] || el.textContent;
  });
}

function updateDeduction(){
  const occ = document.getElementById('occupation').value;
  const occDeduct = { Doctor:5000, Teacher:3000, Engineer:2000, Domestic:1000 }[occ] || 0;
  document.getElementById('tax').textContent = occ ? `+${occDeduct}` : '';
}

function calcTax(){
  const salary = +document.getElementById('salary').value || 0;
  const ra     = +document.getElementById('ra').value || 0;
  const travel = +document.getElementById('travel').value || 0;
  const solar  = +document.getElementById('solar').value || 0;
  const occ    = document.getElementById('occupation').value;
  const occDeduct = { Doctor:5000, Teacher:3000, Engineer:2000, Domestic:1000 }[occ] || 0;
  const taxable = Math.max(salary - ra - travel * 3.82 - solar - occDeduct, 0);
  const tax = Math.max(taxable * 0.18 - 17235, 0);
  document.getElementById('tax').textContent = tax.toFixed(2);
}

document.querySelectorAll('input').forEach(el=>el.addEventListener('input', calcTax));
