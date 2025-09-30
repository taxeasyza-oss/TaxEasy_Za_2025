// TaxEasy_ZA 2025 - Main Application Logic
// Handles initialization, calculations, and form integration

// SARS 2025 Tax Constants
const TAX_CONSTANTS = {
    // Tax brackets for 2025 tax year (individuals under 65)
    TAX_BRACKETS: [
        { min: 0, max: 237100, rate: 0.18, cumulative: 0 },
        { min: 237101, max: 370500, rate: 0.26, cumulative: 42678 },
        { min: 370501, max: 512800, rate: 0.31, cumulative: 77362 },
        { min: 512801, max: 673100, rate: 0.36, cumulative: 121424 },
        { min: 673101, max: 857900, rate: 0.39, cumulative: 179147 },
        { min: 857901, max: 1817000, rate: 0.41, cumulative: 251258 },
        { min: 1817001, max: Infinity, rate: 0.45, cumulative: 644489 }
    ],
    
    // Tax rebates for 2025
    REBATES: {
        primary: 17235,      // All taxpayers
        secondary: 9444,     // Age 65-74
        tertiary: 3145       // Age 75+
    },
    
    // Medical aid tax credits (monthly amounts)
    MEDICAL_CREDITS: {
        main_member: 364,
        dependant: 246
    },
    
    // Deduction limits
    LIMITS: {
        home_office: 15000,
        solar_pv: 1000000,
        retirement_annuity_percentage: 0.275,
        retirement_annuity_max: 350000
    }
};

// Main calculation engine
window.calculateTax = function() {
    console.log('Starting tax calculation...');
    
    try {
        const formData = window.getFormData();
        const calculations = window.performTaxCalculations(formData);
        window.updateTaxDisplay(calculations);
        console.log('Tax calculation completed successfully');
    } catch (error) {
        console.error('Error in tax calculation:', error);
        window.displayCalculationError();
    }
};

// Get form data from all inputs
window.getFormData = function() {
    const form = document.getElementById('taxCalculatorForm');
    if (!form) {
        throw new Error('Tax calculator form not found');
    }
    
    const data = {};
    
    // Helper function to get numeric value
    const getNumericValue = (id) => {
        const element = document.getElementById(id);
        return element ? (parseFloat(element.value) || 0) : 0;
    };
    
    // Helper function to get text value
    const getTextValue = (id) => {
        const element = document.getElementById(id);
        return element ? element.value : '';
    };
    
    // Personal information
    data.fullName = getTextValue('fullName');
    data.idNumber = getTextValue('idNumber');
    data.ageGroup = getTextValue('ageGroup');
    data.occupation = getTextValue('occupation');
    data.emailAddress = getTextValue('emailAddress');
    
    // Income information
    data.basicSalary = getNumericValue('basicSalary');
    data.bonus = getNumericValue('bonus');
    data.overtime = getNumericValue('overtime');
    data.travelAllowance = getNumericValue('travelAllowance');
    data.cellphoneAllowance = getNumericValue('cellphoneAllowance');
    data.otherAllowances = getNumericValue('otherAllowances');
    data.interestIncome = getNumericValue('interestIncome');
    data.dividendIncome = getNumericValue('dividendIncome');
    data.rentalIncome = getNumericValue('rentalIncome');
    
    // Deductions
    data.pensionFund = getNumericValue('pensionFund');
    data.providentFund = getNumericValue('providentFund');
    data.retirementAnnuity = getNumericValue('retirementAnnuity');
    data.medicalAid = getNumericValue('medicalAid');
    data.medicalMembers = getNumericValue('medicalMembers');
    data.medicalDependants = getNumericValue('medicalDependants');
    data.donations = getNumericValue('donations');
    data.homeOffice = getNumericValue('homeOffice');
    data.solarPV = getNumericValue('solarPV');
    data.businessTravel = getNumericValue('businessTravel');
    
    return data;
};

// Perform comprehensive tax calculations
window.performTaxCalculations = function(data) {
    const calculations = {};
    
    // Calculate gross income
    calculations.grossIncome = data.basicSalary + data.bonus + data.overtime + 
                              data.travelAllowance + data.cellphoneAllowance + data.otherAllowances +
                              data.interestIncome + data.dividendIncome + data.rentalIncome;
    
    // Calculate total deductions
    let totalDeductions = data.pensionFund + data.providentFund + data.medicalAid + data.donations;
    
    // Apply retirement annuity limits
    const retirementAnnuityLimit = Math.min(
        data.retirementAnnuity,
        Math.min(calculations.grossIncome * TAX_CONSTANTS.LIMITS.retirement_annuity_percentage, 
                TAX_CONSTANTS.LIMITS.retirement_annuity_max)
    );
    totalDeductions += retirementAnnuityLimit;
    
    // Apply home office limit
    const homeOfficeDeduction = Math.min(data.homeOffice, TAX_CONSTANTS.LIMITS.home_office);
    totalDeductions += homeOfficeDeduction;
    
    // Apply solar PV limit
    const solarPVDeduction = Math.min(data.solarPV, TAX_CONSTANTS.LIMITS.solar_pv);
    totalDeductions += solarPVDeduction;
    
    // Add business travel
    totalDeductions += data.businessTravel;
    
    calculations.totalDeductions = totalDeductions;
    
    // Calculate taxable income
    calculations.taxableIncome = Math.max(0, calculations.grossIncome - totalDeductions);
    
    // Calculate tax before rebates using tax brackets
    calculations.taxBeforeRebates = window.calculateTaxFromBrackets(calculations.taxableIncome);
    
    // Calculate applicable rebates based on age
    calculations.totalRebates = TAX_CONSTANTS.REBATES.primary;
    if (data.ageGroup === '65-74' || data.ageGroup === '75plus') {
        calculations.totalRebates += TAX_CONSTANTS.REBATES.secondary;
    }
    if (data.ageGroup === '75plus') {
        calculations.totalRebates += TAX_CONSTANTS.REBATES.tertiary;
    }
    
    // Calculate medical aid tax credits
    calculations.medicalCredits = (data.medicalMembers * TAX_CONSTANTS.MEDICAL_CREDITS.main_member * 12) +
                                 (data.medicalDependants * TAX_CONSTANTS.MEDICAL_CREDITS.dependant * 12);
    
    // Calculate final tax payable
    calculations.taxPayable = Math.max(0, calculations.taxBeforeRebates - calculations.totalRebates - calculations.medicalCredits);
    
    // Calculate additional metrics
    calculations.monthlyTax = calculations.taxPayable / 12;
    calculations.effectiveRate = calculations.grossIncome > 0 ? (calculations.taxPayable / calculations.grossIncome) * 100 : 0;
    calculations.netIncome = calculations.grossIncome - calculations.taxPayable;
    
    // Calculate marginal tax rate
    calculations.marginalRate = window.getMarginalTaxRate(calculations.taxableIncome);
    
    return calculations;
};

// Calculate tax from brackets
window.calculateTaxFromBrackets = function(taxableIncome) {
    if (taxableIncome <= 0) return 0;
    
    for (let i = 0; i < TAX_CONSTANTS.TAX_BRACKETS.length; i++) {
        const bracket = TAX_CONSTANTS.TAX_BRACKETS[i];
        if (taxableIncome >= bracket.min && taxableIncome <= bracket.max) {
            return bracket.cumulative + ((taxableIncome - bracket.min) * bracket.rate);
        }
    }
    
    // Should not reach here, but fallback to highest bracket
    const highestBracket = TAX_CONSTANTS.TAX_BRACKETS[TAX_CONSTANTS.TAX_BRACKETS.length - 1];
    return highestBracket.cumulative + ((taxableIncome - highestBracket.min) * highestBracket.rate);
};

// Get marginal tax rate
window.getMarginalTaxRate = function(taxableIncome) {
    if (taxableIncome <= 0) return 0;
    
    for (let i = 0; i < TAX_CONSTANTS.TAX_BRACKETS.length; i++) {
        const bracket = TAX_CONSTANTS.TAX_BRACKETS[i];
        if (taxableIncome >= bracket.min && taxableIncome <= bracket.max) {
            return bracket.rate * 100;
        }
    }
    
    // Fallback to highest bracket rate
    return TAX_CONSTANTS.TAX_BRACKETS[TAX_CONSTANTS.TAX_BRACKETS.length - 1].rate * 100;
};

// Update tax display with calculations
window.updateTaxDisplay = function(calculations) {
    // Helper function to format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount).replace('ZAR', 'R');
    };
    
    // Helper function to format percentage
    const formatPercentage = (rate) => {
        return rate.toFixed(2) + '%';
    };
    
    // Update summary display elements
    const updateElement = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    };
    
    updateElement('grossIncome', formatCurrency(calculations.grossIncome));
    updateElement('taxableIncome', formatCurrency(calculations.taxableIncome));
    updateElement('taxPayable', formatCurrency(calculations.taxPayable));
    updateElement('monthlyTax', formatCurrency(calculations.monthlyTax));
    updateElement('effectiveRate', formatPercentage(calculations.effectiveRate));
    updateElement('netIncome', formatCurrency(calculations.netIncome));
    
    // Update additional metrics if elements exist
    updateElement('totalDeductions', formatCurrency(calculations.totalDeductions));
    updateElement('marginalRate', formatPercentage(calculations.marginalRate));
    updateElement('medicalCredits', formatCurrency(calculations.medicalCredits));
    updateElement('totalRebates', formatCurrency(calculations.totalRebates));
    
    console.log('Tax display updated with calculations:', calculations);
};

// Display calculation error
window.displayCalculationError = function() {
    const errorMessage = 'Error calculating tax. Please check your inputs and try again.';
    
    // Update display elements with error message
    const elements = ['grossIncome', 'taxableIncome', 'taxPayable', 'monthlyTax', 'effectiveRate', 'netIncome'];
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = 'Error';
        }
    });
    
    console.error('Tax calculation error displayed');
};

// Initialize application
window.initializeApplication = function() {
    console.log('Initializing TaxEasy_ZA application...');
    
    // Initialize language system
    if (typeof window.initializeLanguageSystem === 'function') {
        window.initializeLanguageSystem();
    }
    
    // Initialize wizard
    if (typeof window.initializeWizard === 'function') {
        window.initializeWizard();
    }
    
    // Setup form event listeners for live calculations
    window.setupCalculationListeners();
    
    // Perform initial calculation
    window.calculateTax();
    
    console.log('Application initialized successfully');
};

// Setup calculation event listeners
window.setupCalculationListeners = function() {
    const form = document.getElementById('taxCalculatorForm');
    if (!form) return;
    
    // Add event listeners to all form inputs
    const inputs = form.querySelectorAll('input[type="number"], input[type="text"], input[type="email"], select');
    
    inputs.forEach(input => {
        // Use input event for real-time updates
        input.addEventListener('input', () => {
            clearTimeout(window.calculationTimeout);
            window.calculationTimeout = setTimeout(() => {
                window.calculateTax();
            }, 300); // Debounce for 300ms
        });
        
        // Use change event for dropdowns and final validation
        input.addEventListener('change', () => {
            window.calculateTax();
        });
    });
    
    console.log('Calculation event listeners setup complete');
};

// Report generation functions using client-side PDF generation
window.downloadBasicReport = async function() {
    console.log("Basic report download requested");
    try {
        const formData = window.getFormData();
        const calculations = window.performTaxCalculations(formData);
        
        // Use the new client-side PDF generator
        await window.generateClientSidePdfReport(calculations, "basic", formData);
        
        // Show success message
        window.showNotification('Basic report generated successfully!', 'success');
    } catch (error) {
        console.error('Error generating basic report:', error);
        window.showNotification('Error generating report. Please try again.', 'error');
    }
};

window.purchaseProfessionalReport = async function() {
    console.log("Professional report purchase requested");
    try {
        const formData = window.getFormData();
        const calculations = window.performTaxCalculations(formData);
        
        // Use the new client-side PDF generator
        await window.generateClientSidePdfReport(calculations, "professional", formData);
        
        // Show success message
        window.showNotification('Professional report generated successfully!', 'success');
    } catch (error) {
        console.error('Error generating professional report:', error);
        window.showNotification('Error generating report. Please try again.', 'error');
    }
};

window.purchasePremiumPackage = async function() {
    console.log("Premium package purchase requested");
    try {
        const formData = window.getFormData();
        const calculations = window.performTaxCalculations(formData);
        
        // Use the new client-side PDF generator
        await window.generateClientSidePdfReport(calculations, "premium", formData);
        
        // Show success message
        window.showNotification('Premium report generated successfully!', 'success');
    } catch (error) {
        console.error('Error generating premium report:', error);
        window.showNotification('Error generating report. Please try again.', 'error');
    }
};

// Preview function for testing
window.previewReport = async function(reportType = 'basic') {
    console.log(`Preview ${reportType} report requested`);
    try {
        const formData = window.getFormData();
        const calculations = window.performTaxCalculations(formData);
        
        // Use the preview function
        await window.previewClientSidePdfReport(calculations, reportType, formData);
        
        console.log('Report preview opened successfully');
    } catch (error) {
        console.error('Error previewing report:', error);
        window.showNotification('Error previewing report. Please try again.', 'error');
    }
};

// Notification system for user feedback
window.showNotification = function(message, type = 'info') {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: 500;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(notification);
    }
    
    // Set message and style based on type
    notification.textContent = message;
    notification.className = `notification ${type}`;
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Show notification
    notification.style.display = 'block';
    notification.style.opacity = '1';
    
    // Hide after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 300);
    }, 5000);
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing application...');
    
    // Small delay to ensure all scripts are loaded
    setTimeout(() => {
        window.initializeApplication();
    }, 100);
});

console.log('Main application script loaded');

