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
