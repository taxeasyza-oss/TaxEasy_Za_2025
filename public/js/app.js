/* 2025 SARS Tax Calculator – 5 pages, 5 languages */
const TEXTS = {
  en: {
    step1:"Step 1 – Personal", step2:"Step 2 – Income", step3:"Step 3 – Deductions",
    step4:"Step 4 – Advanced", step5:"Step 5 – Calculation",
    full_name:"Full Name", age:"Age", salary:"Basic Salary", bonus:"Bonus",
    commission:"Commission", travel:"Travel Allowance", pension:"Pension",
    ra:"Retirement Annuity", medical:"Medical Aid", solar:"Solar §12B",
    homeOffice:"Home Office", occupation:"Occupation",
    deduct_doc:"Doctor: extra R 5 000", deduct_teach:"Teacher: extra R 3 000"
  },
  af: {
    step1:"Stap 1 – Persoonlik", step2:"Stap 2 – Inkomste", step3:"Stap 3 – Aftrekkings",
    step4:"Stap 4 – Gevorderd", step5:"Stap 5 – Berekening",
    full_name:"Volle Naam", age:"Ouderdom", salary:"Basiese Salaris", bonus:"Bonus",
    commission:"Kommissie", travel:"Reistoelaag", pension:"Pensioen",
    ra:"Pensioenfonds", medical:"Mediese Fonds", solar:"Sonkrag §12B",
    homeOffice:"Kantoor tuis", occupation:"Beroep",
    deduct_doc:"Dokter: ekstra R 5 000", deduct_teach:"Onderwyser: ekstra R 3 000"
  },
  zu: {
    step1:"Isinyathelo 1 – Umuntu", step2:"Isinyathelo 2 – Imali engenayo", step3:"Isinyathelo 3 – Izindleko ezingakhokhwa",
    step4:"Isinyathelo 4 – Okwengeziwe", step5:"Isinyathelo 5 – Ukubalwa",
    full_name:"Igama Eligcwele", age:"Iminyaka", salary:"Umholo Oyisisekelo", bonus:"Ibhonasi",
    commission:"Ikhomishini", travel:"Isabelo sohambo", pension:"Ipensheni",
    ra:"Imali Yomhlalaphansi", medical:"Usizo Lwezokwelapha", solar:"Ilanga §12B",
    homeOffice:"Ihhovisi Lasekhaya", occupation:"Umsebenzi",
    deduct_doc:"Udokotela: Okwengeziwe R 5 000", deduct_teach:"Uthisha: Okwengeziwe R 3 000"
  },
  xh: {
    step1:"Inyathelo 1 – Ngokomntu", step2:"Inyathelo 2 – Imali engenayo", step3:"Inyathelo 3 – Izaphulelo",
    step4:"Inyathelo 4 – Ezithe kratya", step5:"Inyathelo 5 – Ukubalwa",
    full_name:"Igama Elipheleleyo", age:"Iminyaka", salary:"Umvuzo oyisiseko", bonus:"Ibhonasi",
    commission:"Ikomishini", travel:"Isabelo sohambo", pension:"Ipensheni", 
    ra:"Imali Yomhlalaphansi", medical:"Uncedo Lwezempilo", solar:"Ilanga §12B",
    homeOffice:"Iofisi yasekhaya", occupation:"Umsebenzi",
    deduct_doc:"Ugqirha: Okunye R 5 000", deduct_teach:"Utitshala: Okunye R 3 000"
  },
  st: {
    step1:"Hlakanipha 1 – Tho", step2:"Hlakanipha 2 – Chelete", step3:"Hlakanipha 3 – Ditshenyehelo",
    step4:"Hlakanipha 4 – Tse kgolo", step5:"Hlakanipha 5 – Palo",
    full_name:"Lebitso le Feletseng", age:"Lilemo", salary:"Moputso wa Motheo", bonus:"Bonse",
    commission:"Komisi", travel:"Chelete ea libaka", pension:"Penche",
    ra:"Chelete ea ho Kgaotsa Mosebetsi", medical:"Thuso ea Bophelo", solar:"Letsatsi §12B",
    homeOffice:"Ofisi ea Lapeng", occupation:"Mosebetsi",
    deduct_doc:"Ngaka: R 5 000 e eketsehileng", deduct_teach:"Titjhere: R 3 000 e eketsehileng"
  }
};

function changeLang(lang){
  localStorage.setItem('lang', lang);
  document.querySelectorAll('[data-txt]').forEach(el=>{
    el.textContent = TEXTS[lang][el.dataset.txt] || el.textContent;
  });
}

function calcTax(){
  // Collect all inputs
  const salary = +document.getElementById('salary').value || 0;
  const bonus = +document.getElementById('bonus').value || 0;
  const ra = +document.getElementById('ra').value || 0;
  const occupation = document.getElementById('occupation').value;
  
  // Calculate gross income
  const gross = salary + bonus;
  
  // Prepare tax data for backend calculation
  const taxData = {
    annualIncome: gross,
    retirementFunding: ra,
    occupationType: occupation === 'doctor' ? 'medical' : 'general',
    occupationDeductions: occupation === 'doctor' ? 5000 : 0
  };
  
  // Get calculated tax from backend
  const result = calculateTax(taxData);
  
  // Update UI with detailed results
  document.getElementById('gross').textContent = gross.toFixed(2);
  document.getElementById('tax').textContent = result.taxPayable.toFixed(2);
  document.getElementById('rebates').textContent = result.rebates.toFixed(2);
}

document.querySelectorAll('input').forEach(el=>el.addEventListener('input', calcTax));
