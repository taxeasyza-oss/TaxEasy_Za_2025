const TEXTS = {
  en: { step1:"Step 1 – Personal", step2:"Step 2 – Income", step3:"Step 3 – Deductions", step4:"Step 4 – Advanced", step5:"Step 5 – Summary", salary:"Basic Salary", ra:"Retirement Annuity", travel:"Travel Allowance (km)", solar:"Solar §12B", tax:"Tax", name:"Full Name", age:"Age" },
  af: { /* Afrikaans */ }, zu: { /* Zulu */ }, xh: { /* Xhosa */ }, st: { /* Sesotho */ }
};

let currentStep = 0;
const steps = document.querySelectorAll('.step');
function showStep(n){ steps.forEach((s,i)=>s.classList.toggle('active', i===n)); }
function nextStep(){ if(currentStep<4){ currentStep++; showStep(currentStep); } }
function prevStep(){ if(currentStep>0){ currentStep--; showStep(currentStep); } }

function changeLang(lang){
  localStorage.setItem('lang', lang);
  document.querySelectorAll('[data-txt]').forEach(el=>{
    el.textContent = TEXTS[lang][el.dataset.txt] || el.textContent;
  });
}

function updateDeduction(){
  const occ = document.getElementById('occupation').value;
  document.getElementById('tax').textContent = occ ? `+${{ Doctor:5000, Teacher:3000, Engineer:2000, Domestic:1000}[occ] || 0}` : '';
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
  document.getElementById('gross').textContent = salary.toFixed(2);
  document.getElementById('tax').textContent = tax.toFixed(2);
}

document.querySelectorAll('input').forEach(el=>el.addEventListener('input', calcTax));
