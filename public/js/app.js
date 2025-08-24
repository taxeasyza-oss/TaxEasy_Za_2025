// Tax Calculator Core Functionality - TypeScript Compatible
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

interface TaxData {
  annualIncome: number;
  retirementFunding: number;
  occupationType: 'medical' | 'general';
  occupationDeductions: number;
}

async function calculateTax(): Promise<void> {
  try {
    // Validate inputs
    const salary = getNumberValue('salary');
    const bonus = getNumberValue('bonus');
    const ra = getNumberValue('ra');
    const occupation = document.getElementById('occupation')?.value || 'general';
    
    const taxData = {
      annualIncome: salary + bonus,
      retirementFunding: ra,
      occupationType: occupation === 'doctor' ? 'medical' : 'general',
      occupationDeductions: occupation === 'doctor' ? 5000 : 0
    };

    // Get CSRF token from cookies
    const csrfToken = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || '';
    
    const response = await fetch('/api/calculate-tax', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': csrfToken
      },
      body: JSON.stringify(taxData)
    });

    if (!response.ok) throw new Error(`Calculation failed: ${response.status}`);
    
    const { taxPayable, rebates } = await response.json();
    
    document.getElementById('tax').textContent = taxPayable.toFixed(2);
    document.getElementById('rebates').textContent = rebates.toFixed(2);
    document.getElementById('tax-error').textContent = '';
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Tax calculation failed');
    }
    
    const result = await response.json();
    
    document.getElementById('gross').textContent = gross.toFixed(2);
    document.getElementById('tax').textContent = result.taxPayable.toFixed(2);
    document.getElementById('rebates').textContent = result.rebates.toFixed(2);
    document.getElementById('tax-error').textContent = '';
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
  
  try {
    const response = await fetch('/api/calculate-tax', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.cookie.replace(/(?:(?:^|.*;\s*)XSRF-TOKEN\s*\=\s*([^;]*).*$)|^.*$/, '$1')
      },
      body: JSON.stringify(taxData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Tax calculation failed');
    }
    
    const result = await response.json();
  
  // Update UI with detailed results
  document.getElementById('gross').textContent = gross.toFixed(2);
  document.getElementById('tax').textContent = result.taxPayable.toFixed(2);
  document.getElementById('rebates').textContent = result.rebates.toFixed(2);
  document.getElementById('tax-error').textContent = '';
}

} catch (error) {
  console.error('Calculation error:', error);
  document.getElementById('tax-error').textContent = error.message;
  document.getElementById('tax').textContent = '0.00';
  document.getElementById('rebates').textContent = '0.00';
}

  } catch (err) {
    console.error('Tax calculation error:', err);
    const errorEl = document.getElementById('tax-error');
    if (errorEl) errorEl.textContent = err.message || 'Calculation failed';
    document.getElementById('tax').textContent = '0.00';
    document.getElementById('rebates').textContent = '0.00';
  }
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('input', () => calculateTax());
  });
  calculateTax();
});
  document.querySelectorAll('input').forEach(el => {
    el.addEventListener('input', () => {
      calculateTax().catch(err => {
        console.error('Event processing error:', err);
      });
    });
  });
}

// Start application
document.addEventListener('DOMContentLoaded', initializeCalculator);

// Update event listeners to handle async
document.querySelectorAll('input').forEach(el => {
  el.addEventListener('input', () => {
    calcTax().catch(error => {
      console.error('Input error:', error);
      document.getElementById('tax-error').textContent = 'Invalid input values';
    });
  });
});
