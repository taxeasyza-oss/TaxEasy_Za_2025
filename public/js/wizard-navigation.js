// TaxEasy_ZA 2025 - Wizard Navigation System
// Handles multi-step form navigation with proper validation and state management

window.currentStep = 1;
window.totalSteps = 5;

// Initialize wizard on page load
window.initializeWizard = function() {

    console.log("Initializing wizard...");
    window.showStep(window.currentStep);
    window.updateNavigation();
    window.updateStepIndicator();
    window.updateProgress();
    window.setupEventListeners();
    
    // Initialize tooltips if available
    if (typeof window.initializeTooltips === 'function') {
        window.initializeTooltips();
    }
    
    // Initialize translations if available
    if (typeof window.updatePageTranslations === 'function') {
        window.updatePageTranslations();
    }
    
    console.log('Wizard initialized successfully');
};

// Show specific step and hide others
window.showStep = function(stepNum) {
    console.log(`Showing step ${stepNum}`);
    
    // Hide all wizard steps
    const steps = document.querySelectorAll('.wizard-step');
    steps.forEach((step, index) => {
        if (index + 1 === stepNum) {
            step.classList.add('active');
            step.style.display = 'block';
        } else {
            step.classList.remove('active');
            step.style.display = 'none';
        }
    });
    
    // Update step indicator
    window.updateStepIndicator();
    
    // Scroll to top of form
    const wizardContainer = document.querySelector('.wizard-container');
    if (wizardContainer) {
        wizardContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

// Update navigation buttons
window.updateNavigation = function() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.style.display = window.currentStep === 1 ? 'none' : 'inline-block';
    }
    
    if (nextBtn) {
        if (window.currentStep === window.totalSteps) {
            nextBtn.textContent = window.translate ? window.translate('download_basic') : 'Download Basic Report';
            nextBtn.classList.add('final-step');
        } else {
            nextBtn.textContent = window.translate ? window.translate('next') : 'Next →';
            nextBtn.classList.remove('final-step');
        }
    }
};

// Update step indicator visual state
window.updateStepIndicator = function() {
    const stepIndicators = document.querySelectorAll('.step-indicator .step');
    
    stepIndicators.forEach((indicator, index) => {
        const stepNumber = index + 1;
        
        // Remove all state classes
        indicator.classList.remove('active', 'completed');
        
        // Add appropriate state class
        if (stepNumber === window.currentStep) {
            indicator.classList.add('active');
        } else if (stepNumber < window.currentStep) {
            indicator.classList.add('completed');
        }
    });
};

// Update progress tracking
window.updateProgress = function() {
    const form = document.getElementById('taxCalculatorForm');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input[type="number"]:not([readonly]), input[type="text"]:not([readonly]), input[type="email"]:not([readonly]), select:not([readonly])');
    let filledFields = 0;
    
    inputs.forEach(input => {
        if (input.value && input.value.trim() !== '' && input.value !== '0') {
            filledFields++;
        }
    });
    
    const totalFields = inputs.length;
    const completionPercentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
    
    // Update progress display
    const completionElement = document.getElementById('completionPercentage');
    const fieldsElement = document.getElementById('fieldsCompleted');
    
    if (completionElement) {
        completionElement.textContent = `${completionPercentage}%`;
    }
    
    if (fieldsElement) {
        fieldsElement.textContent = `${filledFields}/${totalFields}`;
    }
    
    // Update estimated time based on completion
    const estimatedTimeElement = document.getElementById('estimatedTime');
    if (estimatedTimeElement) {
        const remainingFields = totalFields - filledFields;
        const estimatedMinutes = Math.max(1, Math.ceil(remainingFields * 0.2)); // ~12 seconds per field
        estimatedTimeElement.textContent = `${estimatedMinutes} min`;
    }
};

// Navigate to next step
window.nextStep = function() {
    console.log(`Next step called. Current: ${window.currentStep}, Total: ${window.totalSteps}`);
    
    if (window.currentStep < window.totalSteps) {
        // Validate current step before proceeding
        if (window.validateCurrentStep()) {
            window.currentStep++;
            window.showStep(window.currentStep);
            window.updateNavigation();
            window.updateProgress();
            
            // Trigger calculations if available
            if (typeof window.calculateTax === 'function') {
                window.calculateTax();
            }
            
            // Update translations for new step
            if (typeof window.updatePageTranslations === 'function') {
                window.updatePageTranslations();
            }
            
            // Update tooltips for new step
            if (typeof window.updateTooltips === 'function') {
                window.updateTooltips();
            }
        }
    } else if (window.currentStep === window.totalSteps) {
        // Handle final step action
        console.log('Final step - triggering basic report download');
        if (typeof window.downloadBasicReport === 'function') {
            window.downloadBasicReport();
        } else {
            alert('Download functionality will be implemented soon!');
        }
    }
};

// Navigate to previous step
window.prevStep = function() {
    console.log(`Previous step called. Current: ${window.currentStep}`);
    
    if (window.currentStep > 1) {
        window.currentStep--;
        window.showStep(window.currentStep);
        window.updateNavigation();
        window.updateProgress();
        
        // Trigger calculations if available
        if (typeof window.calculateTax === 'function') {
            window.calculateTax();
        }
        
        // Update translations for new step
        if (typeof window.updatePageTranslations === 'function') {
            window.updatePageTranslations();
        }
        
        // Update tooltips for new step
        if (typeof window.updateTooltips === 'function') {
            window.updateTooltips();
        }
    }
};

// Validate current step
window.validateCurrentStep = function() {
    const currentStepElement = document.getElementById(`step${window.currentStep}`);
    if (!currentStepElement) {
        console.warn(`Step element step${window.currentStep} not found`);
        return true; // Allow progression if element not found
    }
    
    const requiredInputs = currentStepElement.querySelectorAll('input[required], select[required]');
    let isValid = true;
    let firstInvalidField = null;
    
    requiredInputs.forEach(input => {
        const value = input.value ? input.value.trim() : '';
        
        if (!value) {
            isValid = false;
            input.classList.add('is-invalid');
            
            if (!firstInvalidField) {
                firstInvalidField = input;
            }
        } else {
            input.classList.remove('is-invalid');
        }
    });
    
    // Focus on first invalid field if validation failed
    if (!isValid && firstInvalidField) {
        firstInvalidField.focus();
        
        // Show validation message
        const fieldName = firstInvalidField.previousElementSibling?.textContent || 'This field';
        alert(`${fieldName} is required. Please fill in this field to continue.`);
    }
    
    return isValid;
};

// Setup event listeners
window.setupEventListeners = function() {
    console.log('Setting up event listeners...');
    
    // Navigation buttons
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    
    if (nextBtn) {
        nextBtn.addEventListener('click', window.nextStep);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', window.prevStep);
    }
    
    // Form input listeners for live updates
    const form = document.getElementById('taxCalculatorForm');
    if (form) {
        form.addEventListener('input', (e) => {
            // Update progress on any input change
            window.updateProgress();
            
            // Trigger live calculations if available
            if (typeof window.calculateTax === 'function') {
                clearTimeout(window.calculationTimeout);
                window.calculationTimeout = setTimeout(() => {
                    window.calculateTax();
                }, 300); // Debounce calculations
            }
        });
        
        form.addEventListener('change', (e) => {
            // Handle dropdown changes and other change events
            window.updateProgress();
            
            if (typeof window.calculateTax === 'function') {
                window.calculateTax();
            }
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'ArrowRight' && window.currentStep < window.totalSteps) {
                e.preventDefault();
                window.nextStep();
            } else if (e.key === 'ArrowLeft' && window.currentStep > 1) {
                e.preventDefault();
                window.prevStep();
            }
        }
    });
    
    // Report buttons (if they exist)
    const downloadBasicBtn = document.getElementById('downloadBasicReport');
    const purchaseProfessionalBtn = document.getElementById('purchaseProfessionalReport');
    const purchasePremiumBtn = document.getElementById('purchasePremiumPackage');
    
    if (downloadBasicBtn) {
        downloadBasicBtn.addEventListener('click', () => {
            if (typeof window.downloadBasicReport === 'function') {
                window.downloadBasicReport();
            } else {
                alert('Basic report download functionality will be implemented soon!');
            }
        });
    }
    
    if (purchaseProfessionalBtn) {
        purchaseProfessionalBtn.addEventListener('click', () => {
            if (typeof window.purchaseProfessionalReport === 'function') {
                window.purchaseProfessionalReport();
            } else {
                alert('Professional report purchase functionality will be implemented soon!');
            }
        });
    }
    
    if (purchasePremiumBtn) {
        purchasePremiumBtn.addEventListener('click', () => {
            if (typeof window.purchasePremiumPackage === 'function') {
                window.purchasePremiumPackage();
            } else {
                alert('Premium package purchase functionality will be implemented soon!');
            }
        });
    }
    
    console.log('Event listeners setup complete');
};

// Tax tip rotation functionality
const taxTips = [
    "Complete all sections for the most accurate tax calculation and maximize your refund potential.",
    "Keep all your IRP5s, medical aid certificates, and donation receipts handy for accurate reporting.",
    "Did you know you can claim home office expenses if you work from home regularly?",
    "Contributions to retirement annuities are tax-deductible and reduce your taxable income.",
    "Don't forget to declare all interest and dividend income to SARS - even small amounts count.",
    "Solar PV installations qualify for Section 12B tax incentives - claim up to R1 million!",
    "Medical aid contributions and additional medical expenses can significantly reduce your tax.",
    "Business travel expenses are deductible if properly documented with receipts and logbooks."
];

let currentTipIndex = 0;

window.rotateTip = function() {
    currentTipIndex = (currentTipIndex + 1) % taxTips.length;
    const tipElement = document.getElementById('currentTip');
    if (tipElement) {
        tipElement.textContent = taxTips[currentTipIndex];
    }
};

// Auto-rotate tips every 10 seconds
setInterval(window.rotateTip, 10000);

// Initialize wizard when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.initializeWizard);
} else {
    window.initializeWizard();
}

console.log('Wizard navigation system loaded');

