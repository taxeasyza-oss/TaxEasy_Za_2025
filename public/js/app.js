document.addEventListener('DOMContentLoaded', () => {
  const steps = document.querySelectorAll('.step');
  const nextBtns = document.querySelectorAll('.next-btn');
  const prevBtns = document.querySelectorAll('.prev-btn');
  let currentStep = 0;

  // Initialize step visibility
  steps.forEach((step, index) => {
    if (index === 0) step.classList.add('active');
    else step.classList.remove('active');
  });

  // Step navigation logic
  function showStep(stepIndex) {
    steps.forEach((step, index) => {
      step.classList.toggle('active', index === stepIndex);
    });
    currentStep = stepIndex;
  }

  // Next button handlers
  nextBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (validateStep(currentStep)) {
        showStep(currentStep + 1);
        if (currentStep === 4) calculateTax();
      }
    });
    
    // PDF Generation Function
    function generatePDF() {
      const doc = new jsPDF();
      const taxAmount = document.getElementById('tax').textContent;
      doc.setFontSize(18);
      doc.text(`TaxEasy ZA 2025 Tax Report`, 10, 20);
      doc.setFontSize(12);
      doc.text(`Calculated Tax Amount: R ${taxAmount}`, 10, 30);
      doc.text(`Calculation Date: ${new Date().toLocaleDateString()}`, 10, 40);
      doc.save(`tax-report-${new Date().toISOString().slice(0,10)}.pdf`);
    }
    
    // PayFast Sandbox Integration
    window.payFast = {
      pay: () => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://sandbox.payfast.co.za/eng/process';
        form.innerHTML = `
          <input type="hidden" name="merchant_id" value="10000100">
          <input type="hidden" name="merchant_key" value="46f0cd694581a">
          <input type="hidden" name="amount" value="9900">
          <input type="hidden" name="item_name" value="Tax Report PDF">
          <input type="hidden" name="return_url" value="${window.location.origin}/payment-success">
          <input type="hidden" name="cancel_url" value="${window.location.origin}/payment-cancelled">
        `;
        document.body.appendChild(form);
        form.submit();
      }
    };
  });

  // Previous button handlers
  prevBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showStep(currentStep - 1);
    });
  });

  // Trigger tax calculation when reaching summary step
  function calculateTax() {
    window.taxCalculator.calculate();
  }

  // Basic step validation
  function validateStep(step) {
    switch(step) {
      case 0:
        return document.getElementById('name').value.trim() !== '' && 
               document.getElementById('age').value.trim() !== '';
      case 1:
        return document.getElementById('salary').value.trim() !== '';
      default:
        return true;
    }
  }
});
