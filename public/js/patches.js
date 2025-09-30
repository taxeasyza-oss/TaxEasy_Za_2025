/* BEGIN PRESERVATION PATCHES - DO NOT EDIT ABOVE */

// FIX-001: Feature flags configuration
window.TAX_EASY_FLAGS = {
    PAYFAST_LIVE: false,   // keep sandbox until owner flips
    PDF_GENERATION: true,
    NEW_CONTRAST: true,
    POPIA_COMPLIANCE: true,
    DARK_MODE: true,
    ENHANCED_VALIDATION: true
};

// FIX-002: Remove Jozi Angels references
document.addEventListener('DOMContentLoaded', function() {
    // Replace all "Powered by Jozi Angels" text
    const joziElements = document.querySelectorAll('[data-translate="powered_by"]');
    joziElements.forEach(element => {
        element.textContent = 'Professional Tax Solutions';
    });
    
    // Update copyright text
    const copyrightElements = document.querySelectorAll('footer p');
    copyrightElements.forEach(element => {
        if (element.textContent.includes('Jozi Angels')) {
            element.innerHTML = element.innerHTML.replace(/Powered by Jozi Angels/g, 'Professional Tax Solutions');
        }
    });
});

// FIX-003: Enhanced tax calculation with PAYE and provisional tax
function calculateTaxWithDeductions(income, paye = 0, provisional = 0) {
    // ORIG: const normalTax = calculateNormalTax(income);
    const normalTax = calculateNormalTax(income);
    const rebates = calculateRebates();
    const credits = calculateCredits();
    
    // New calculation including PAYE and provisional tax
    const finalAmount = normalTax - rebates - credits - paye - provisional;
    
    return {
        normalTax,
        rebates,
        credits,
        paye,
        provisional,
        finalAmount,
        isRefund: finalAmount < 0,
        displayAmount: Math.abs(finalAmount)
    };
}

// FIX-004: POPIA compliance enhancements
function initializePOPIACompliance() {
    if (!window.TAX_EASY_FLAGS.POPIA_COMPLIANCE) return;
    
    // Show POPIA banner if not previously accepted
    const popiaAccepted = localStorage.getItem('popia_accepted');
    if (!popiaAccepted) {
        const banner = document.getElementById('popiaConsent');
        if (banner) {
            banner.style.display = 'block';
            document.body.style.paddingTop = '120px'; // Adjust for banner height
        }
    }
    
    // Handle POPIA acceptance
    const acceptBtn = document.getElementById('acceptPopia');
    const declineBtn = document.getElementById('declinePopia');
    
    if (acceptBtn) {
        acceptBtn.addEventListener('click', function() {
            localStorage.setItem('popia_accepted', 'true');
            localStorage.setItem('popia_accepted_date', new Date().toISOString());
            document.getElementById('popiaConsent').style.display = 'none';
            document.body.style.paddingTop = '0';
        });
    }
    
    if (declineBtn) {
        declineBtn.addEventListener('click', function() {
            alert('You must accept our privacy policy to use this service.');
        });
    }
}

// FIX-005: Enhanced form validation with aria-live
function enhanceFormValidation() {
    if (!window.TAX_EASY_FLAGS.ENHANCED_VALIDATION) return;
    
    const numericInputs = document.querySelectorAll('input[type="number"], input[inputmode="numeric"]');
    
    numericInputs.forEach(input => {
        // Change type to text with numeric inputmode for better mobile support
        if (input.type === 'number') {
            input.type = 'text';
            input.setAttribute('inputmode', 'numeric');
            input.setAttribute('pattern', '[0-9]*');
        }
        
        // Add real-time validation
        input.addEventListener('input', function() {
            const value = this.value.replace(/[^0-9.]/g, '');
            this.value = value;
            
            // Remove existing validation feedback
            const existingFeedback = this.parentNode.querySelector('.invalid-feedback');
            if (existingFeedback) {
                existingFeedback.remove();
            }
            
            this.classList.remove('is-invalid');
            
            // Validate numeric input
            if (value && (isNaN(value) || parseFloat(value) < 0)) {
                this.classList.add('is-invalid');
                
                const feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                feedback.setAttribute('aria-live', 'polite');
                feedback.textContent = 'Please enter a valid positive number';
                this.parentNode.appendChild(feedback);
            }
        });
    });
}

// FIX-006: Dark mode implementation
function initializeDarkMode() {
    if (!window.TAX_EASY_FLAGS.DARK_MODE) return;
    
    // Create dark mode toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'dark-mode-toggle';
    toggleBtn.innerHTML = '🌙';
    toggleBtn.setAttribute('aria-label', 'Toggle dark mode');
    toggleBtn.title = 'Toggle dark mode';
    
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
    
    if (isDark) {
        document.body.classList.add('dark-mode');
        toggleBtn.innerHTML = '☀️';
    }
    
    toggleBtn.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        this.innerHTML = isDarkMode ? '☀️' : '🌙';
    });
    
    document.body.appendChild(toggleBtn);
}

// FIX-007: PayFast integration enhancement
function initializePayFastIntegration() {
    if (!window.TAX_EASY_FLAGS.PDF_GENERATION) return;
    
    // Add price display to buy button
    const buyButtons = document.querySelectorAll('.btn-buy-report, [data-action="buy-report"]');
    buyButtons.forEach(button => {
        if (!button.querySelector('.price-display')) {
            const priceDiv = document.createElement('div');
            priceDiv.className = 'price-display';
            priceDiv.textContent = 'R 149.00 incl. VAT';
            priceDiv.title = 'You will receive a full PDF report and the e-Filing guide in your chosen language.';
            
            button.parentNode.insertBefore(priceDiv, button.nextSibling);
        }
    });
}

// FIX-008: Progress bar enhancement
function enhanceProgressBar() {
    const progressContainer = document.querySelector('.progress, .wizard-progress');
    if (!progressContainer) return;
    
    // Replace existing progress bar with enhanced version
    progressContainer.innerHTML = `
        <div class="progress-bar-enhanced">
            <div class="progress-fill" style="width: 0%"></div>
        </div>
    `;
    
    // Update progress based on visible sections
    function updateProgress() {
        const sections = document.querySelectorAll('.wizard-step, .form-section');
        const visibleSections = Array.from(sections).filter(section => 
            section.style.display !== 'none' && !section.classList.contains('hidden')
        );
        const currentSection = document.querySelector('.wizard-step.active, .form-section.active');
        
        if (visibleSections.length > 0 && currentSection) {
            const currentIndex = visibleSections.indexOf(currentSection);
            const progress = ((currentIndex + 1) / visibleSections.length) * 100;
            
            const progressFill = document.querySelector('.progress-fill');
            if (progressFill) {
                progressFill.style.width = progress + '%';
            }
        }
    }
    
    // Observe for changes in wizard steps
    const observer = new MutationObserver(updateProgress);
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class', 'style'],
        subtree: true
    });
    
    updateProgress();
}

// FIX-009: Enhanced tax result display
function enhanceTaxResultDisplay() {
    // Monitor for tax calculation results
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const resultElements = document.querySelectorAll('.tax-result, .calculation-result');
                resultElements.forEach(element => {
                    if (!element.classList.contains('enhanced')) {
                        enhanceSingleResult(element);
                        element.classList.add('enhanced');
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

function enhanceSingleResult(element) {
    const resultText = element.textContent;
    const amount = resultText.match(/R\s*([\d,]+\.?\d*)/);
    
    if (amount) {
        const isOwing = resultText.toLowerCase().includes('owing') || 
                       resultText.toLowerCase().includes('payable') ||
                       resultText.toLowerCase().includes('due to sars');
        
        element.className += ' tax-result-box' + (isOwing ? ' owing' : '');
        
        const amountSpan = document.createElement('span');
        amountSpan.className = 'tax-result-amount';
        amountSpan.textContent = 'R ' + amount[1];
        
        const labelDiv = document.createElement('div');
        labelDiv.textContent = isOwing ? 'Amount payable to SARS' : 'Refund due to you';
        
        element.innerHTML = '';
        element.appendChild(labelDiv);
        element.appendChild(amountSpan);
    }
}

// FIX-010: Initialize all enhancements
document.addEventListener('DOMContentLoaded', function() {
    initializePOPIACompliance();
    enhanceFormValidation();
    initializeDarkMode();
    initializePayFastIntegration();
    enhanceProgressBar();
    enhanceTaxResultDisplay();
    initializePromoCodeSystem();
});

// FIX-011: Skip links for accessibility
function addSkipLinks() {
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        text-decoration: none;
        z-index: 10000;
        border-radius: 4px;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Ensure main content has ID
    const mainContent = document.querySelector('main, .main-content, .container');
    if (mainContent && !mainContent.id) {
        mainContent.id = 'main-content';
    }
}

// Initialize skip links
document.addEventListener('DOMContentLoaded', addSkipLinks);

/* END PRESERVATION PATCHES */



// ===========================================
// BEGIN FIX-#PROMO-CODES promotional code system – DO NOT EDIT ABOVE
// ===========================================

/**
 * Promotional Code System
 * 
 * This system allows users to enter promotional codes to bypass PayFast payment
 * and access premium PDF reports for testing purposes.
 */

// Global variable to track promo code status
window.promoCodeApplied = false;
window.appliedPromoCode = null;

/**
 * Initialize promotional code system
 */
function initializePromoCodeSystem() {
    console.log("Initializing promotional code system...");
    // Only initialize if feature is enabled
    if (!window.TaxEasyConfig || !window.TaxEasyConfig.promoCodes || !window.TaxEasyConfig.promoCodes.enabled) {
        return;
    }
    
    // Get UI elements for the new modal
    const showPromoLink = document.getElementById('showPromoCodeLink');
    const promoCodeModal = document.getElementById('promoCodeModal');
    const closeButton = promoCodeModal ? promoCodeModal.querySelector(".close-button") : null;
    const promoInput = document.getElementById('promoCodeInput');
    const applyButton = document.getElementById('applyPromoCode');
    const messageDiv = document.getElementById('promoCodeMessage');
    const purchaseButton = document.getElementById('purchaseProfessionalReport');

    if (!showPromoLink || !promoCodeModal || !closeButton || !promoInput || !applyButton || !messageDiv || !purchaseButton) {
        console.warn('Promotional code modal elements not found');
        return;
    }

    // Show the modal when the link is clicked
    showPromoLink.addEventListener('click', function(e) {
        e.preventDefault();
        promoCodeModal.style.display = 'block';
    });

    // Close the modal when the close button is clicked
    closeButton.addEventListener('click', function() {
        promoCodeModal.style.display = 'none';
    });

    // Close the modal when the user clicks anywhere outside of the modal content
    window.addEventListener('click', function(event) {
        if (event.target == promoCodeModal) {
            promoCodeModal.style.display = 'none';
        }
    });
    
    // Apply promotional code
    applyButton.addEventListener('click', function() {
        const code = promoInput.value.trim();
        if (!code) {
            showPromoMessage('Please enter a promotional code.', 'error');
            return;
        }
        
        validatePromoCode(code);
    });
    
    // Allow Enter key to apply code
    promoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyButton.click();
        }
    });
    
    // Update purchase button behavior if promo code is applied
    const originalPurchaseHandler = purchaseButton.onclick;
    purchaseButton.addEventListener('click', function(e) {
        if (window.promoCodeApplied) {
            e.preventDefault();
            e.stopPropagation();
            
            // Bypass payment and generate PDF directly
            const taxData = window.taxCalculator.getTaxData();
            const userInfo = window.taxCalculator.getUserInfo();
            const pdfGenerator = new TaxEasyPDFGenerator();
            pdfGenerator.initialize().then(() => {
                pdfGenerator.generatePDF(taxData, userInfo, 'professional');
            });
        }
        // If no promo code applied, let original handler run
    });
}

/**
 * Validate promotional code against configured codes
 */
function validatePromoCode(code) {
    const messageDiv = document.getElementById("promoCodeMessage");
    const applyButton = document.getElementById("applyPromoCode");
    const promoInput = document.getElementById("promoCodeInput");
    
    // Disable button during validation
    applyButton.disabled = true;
    applyButton.textContent = "Validating...";
    
    // Check if code exists and is not used
    const promoConfig = window.TaxEasyConfig.promoCodes;
    const codeEntry = promoConfig.codes.find(entry => entry.code === code);
    
    setTimeout(() => {
        if (!codeEntry) {
            showPromoMessage("Invalid promotional code. Please check your code and try again.", "error");
        } else if (codeEntry.used) {
            showPromoMessage("This promotional code has already been used.", "error");
        } else {
            // Mark code as used
            codeEntry.used = true;
            
            // Set global flags
            window.promoCodeApplied = true;
            window.appliedPromoCode = code;
            
            // Show success message
            showPromoMessage(`✅ Promotional code applied successfully! You can now download the professional report for free.`, "success");
            
            // Update UI
            updateUIForAppliedPromoCode();
            
            // Disable input and button
            promoInput.disabled = true;
            applyButton.disabled = true;
            applyButton.textContent = "Applied";
        }
        
        // Re-enable button if not successful
        if (!window.promoCodeApplied) {
            applyButton.disabled = false;
            applyButton.textContent = "Apply";
        }
    }, 1000); // Simulate validation delay
}

/**
 * Show promotional code message
 */
function showPromoMessage(message, type) {
    const messageDiv = document.getElementById(\'promoCodeMessage\');
    if (!messageDiv) return;
    
    messageDiv.textContent = message;
    messageDiv.className = `promo-message ${type}`;
    
    // Add styles for different message types
    if (type === \'success\') {
        messageDiv.style.color = \'#28a745\';
        messageDiv.style.backgroundColor = \'#\n(Content truncated due to size limit. Use page ranges or line ranges to read remaining content)

    
    // Allow Enter key to apply code
    promoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            applyButton.click();
        }
    });
    
    // Update purchase button behavior if promo code is applied
    const originalPurchaseHandler = purchaseButton.onclick;
    purchaseButton.addEventListener('click', function(e) {
        if (window.promoCodeApplied) {
            e.preventDefault();
            e.stopPropagation();
            
            // Bypass payment and generate PDF directly
            const taxData = window.taxCalculator.getTaxData();
            const userInfo = window.taxCalculator.getUserInfo();
            const pdfGenerator = new TaxEasyPDFGenerator();
            pdfGenerator.initialize().then(() => {
                pdfGenerator.generatePDF(taxData, userInfo, 'professional');
            });
        }
        // If no promo code applied, let original handler run
    });
}

/**
 * Validate promotional code against configured codes
 */
function validatePromoCode(code) {
    const messageDiv = document.getElementById('promoCodeMessage');
    const applyButton = document.getElementById('applyPromoCode');
    const promoInput = document.getElementById('promoCodeInput');
    
    // Disable button during validation
    applyButton.disabled = true;
    applyButton.textContent = 'Validating...';
    
    // Check if code exists and is not used
    const promoConfig = window.TaxEasyConfig.promoCodes;
    const codeEntry = promoConfig.codes.find(entry => entry.code === code);
    
    setTimeout(() => {
        if (!codeEntry) {
            showPromoMessage('Invalid promotional code. Please check your code and try again.', 'error');
        } else if (codeEntry.used) {
            showPromoMessage('This promotional code has already been used.', 'error');
        } else {
            // Mark code as used
            codeEntry.used = true;
            
            // Set global flags
            window.promoCodeApplied = true;
            window.appliedPromoCode = code;
            
            // Show success message
            showPromoMessage(`✅ Promotional code applied successfully! You can now download the professional report for free.`, 'success');
            
            // Update UI
            updateUIForAppliedPromoCode();
            
            // Disable input and button
            promoInput.disabled = true;
            applyButton.disabled = true;
            applyButton.textContent = 'Applied';
        }
        
        // Re-enable button if not successful
        if (!window.promoCodeApplied) {
            applyButton.disabled = false;
            applyButton.textContent = 'Apply';
        }
    }, 1000); // Simulate validation delay
}

/**
 * Show promotional code message
 */
function showPromoMessage(message, type) {
    const messageDiv = document.getElementById("promoCodeMessage");
    if (!messageDiv) return;
    
    messageDiv.textContent = message;
    messageDiv.className = `promo-message ${type}`;
    
    // Add styles for different message types
    if (type === "success") {
        messageDiv.style.color = "#28a745";
        messageDiv.style.backgroundColor = "#d4edda";
        messageDiv.style.border = "1px solid #c3e6cb";
    } else if (type === "error") {
        messageDiv.style.color = "#dc3545";
        messageDiv.style.backgroundColor = "#f8d7da";
        messageDiv.style.border = "1px solid #f5c6cb";
    }
    
    messageDiv.style.padding = "0.5rem";
    messageDiv.style.borderRadius = "3px";
    messageDiv.style.marginTop = "0.5rem";
}

/**
 * Update UI when promotional code is applied
 */
function updateUIForAppliedPromoCode() {
    const purchaseButton = document.getElementById('purchaseProfessionalReport');
    const showPromoLink = document.getElementById('showPromoCodeLink');
    
    if (purchaseButton) {
        purchaseButton.textContent = 'Download Professional Report (FREE)';
        purchaseButton.style.backgroundColor = '#28a745';
        purchaseButton.style.borderColor = '#28a745';
    }
    
    if (showPromoLink) {
        showPromoLink.style.display = 'none';
    }
}

/**
 * Generate professional PDF with promotional code (bypass payment)
 */
function generateProfessionalPDFWithPromoCode() {
    // Show loading state
    const purchaseButton = document.getElementById('purchaseProfessionalReport');
    const originalText = purchaseButton.textContent;
    purchaseButton.disabled = true;
    purchaseButton.textContent = 'Generating PDF...';
    
    try {
        // Use existing PDF generation function but mark as professional
        if (window.generateClientSidePDF) {
            window.generateClientSidePDF(true); // true = professional version
            
            // Show success message
            setTimeout(() => {
                alert('✅ Professional PDF report generated successfully using promotional code: ' + window.appliedPromoCode);
                purchaseButton.disabled = false;
                purchaseButton.textContent = originalText;
            }, 2000);
        } else {
            throw new Error('PDF generation function not available');
        }
    } catch (error) {
        console.error('Error generating PDF with promo code:', error);
        alert('❌ Error generating PDF. Please try again or contact support.');
        purchaseButton.disabled = false;
        purchaseButton.textContent = originalText;
    }
}

/**
 * Check if promotional code system should be available
 */
function isPromoCodeSystemAvailable() {
    return window.TaxEasyConfig && 
           window.TaxEasyConfig.promoCodes && 
           window.TaxEasyConfig.promoCodes.enabled &&
           window.TaxEasyConfig.promoCodes.codes &&
           window.TaxEasyConfig.promoCodes.codes.length > 0;
}

// Initialize promotional code system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Ensure the promo code system initializes after all other DOM content and scripts are parsed.
    // A slight delay can help if elements are dynamically rendered by other scripts.
    if (window.TaxEasyConfig && window.TaxEasyConfig.promoCodes && window.TaxEasyConfig.promoCodes.enabled) {
        // Use a small timeout to ensure all elements are rendered, especially if they are dynamically added.
        setTimeout(initializePromoCodeSystem, 100);
    }
});

// ===========================================
// END FIX-#PROMO-CODES promotional code system
// ===========================================

