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
  // Validate inputs
  const salary = validateInput('salary', 'Basic salary required');
  const ra = validateInput('ra', 'RA contribution required');
  const travel = validateInput('travel', 'Travel km required');
  const solar = +document.getElementById('solar').value || 0;
  const occ = document.getElementById('occupation').value;
  const occDeduct = { Doctor:5000, Teacher:3000, Engineer:2000, Domestic:1000 }[occ] || 0;

  // Calculate using 2025 tax brackets
  const taxable = Math.max(salary -
    Math.min(ra, salary * 0.275, 350000) - // RA cap
    travel * 3.82 -
    solar -
    occDeduct, 0);

  let tax = 0;
  let remaining = taxable;
  const { TAX_BRACKETS } = await import('./tax-constants-2025.js');
  
  for (const { threshold, rate } of TAX_BRACKETS) {
    if (remaining <= 0) break;
    const bracketAmount = Math.min(remaining, threshold);
    tax += bracketAmount * rate;
    remaining -= bracketAmount;
  }

  tax = Math.max(tax - 17235, 0); // Apply primary rebate
  document.getElementById('gross').textContent = salary.toFixed(2);
  document.getElementById('tax').textContent = tax.toFixed(2);
}

document.querySelectorAll('input').forEach(el=>el.addEventListener('input', calcTax));
