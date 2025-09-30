// PayFast Payment Integration for TaxEasy_ZA 2025
// Professional Report Payment Processing

class PayFastIntegration {
    constructor() {
        this.merchantId = '10000100'; // Test merchant ID - replace with live merchant ID
        this.merchantKey = '46f0cd694581a'; // Test merchant key - replace with live merchant key
        this.passPhrase = 'jt7NOE43FZPn'; // Test passphrase - replace with live passphrase
        this.testMode = true; // Set to false for production
        this.baseUrl = this.testMode ? 'https://sandbox.payfast.co.za/eng/process' : 'https://www.payfast.co.za/eng/process';
    }

    // Generate payment form for Professional Report (R99)
    generatePaymentForm(userDetails, reportType = 'professional') {
        const amount = reportType === 'professional' ? '99.00' : '199.00';
        const itemName = reportType === 'professional' ? 'Professional Tax Report' : 'Premium Tax Package';
        const itemDescription = reportType === 'professional' ? 
            'Detailed tax breakdown, optimization advice, and SARS eFiling guide' :
            'Everything in Professional + 30-min consultation call + Priority support';

        const paymentData = {
            merchant_id: this.merchantId,
            merchant_key: this.merchantKey,
            return_url: window.location.origin + '/payment-success.html',
            cancel_url: window.location.origin + '/payment-cancelled.html',
            notify_url: window.location.origin + '/payment-notify',
            name_first: userDetails.firstName || userDetails.fullName.split(' ')[0],
            name_last: userDetails.lastName || userDetails.fullName.split(' ').slice(1).join(' '),
            email_address: userDetails.email,
            m_payment_id: this.generatePaymentId(),
            amount: amount,
            item_name: itemName,
            item_description: itemDescription,
            custom_str1: reportType,
            custom_str2: JSON.stringify(userDetails.taxData || {}),
            custom_str3: userDetails.language || 'en'
        };

        // Generate signature (simplified for demo - should be server-side in production)
        paymentData.signature = this.generateSignature(paymentData);

        return this.createPaymentForm(paymentData);
    }

    // Generate unique payment ID
    generatePaymentId() {
        return 'TAXEASY_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Generate PayFast signature (simplified for demo)
    generateSignature(data) {
        // Create parameter string
        let paramString = '';
        const sortedKeys = Object.keys(data).sort();
        
        for (let key of sortedKeys) {
            if (key !== 'signature' && data[key] !== '') {
                paramString += key + '=' + encodeURIComponent(data[key]).replace(/%20/g, '+') + '&';
            }
        }
        
        // Remove trailing &
        paramString = paramString.slice(0, -1);
        
        // Add passphrase if set
        if (this.passPhrase) {
            paramString += '&passphrase=' + encodeURIComponent(this.passPhrase);
        }

        // Simple hash for demo (use proper server-side implementation in production)
        return this.simpleHash(paramString);
    }

    // Simple hash function for demo purposes
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash).toString(16);
    }

    // Create payment form
    createPaymentForm(paymentData) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = this.baseUrl;
        form.style.display = 'none';

        for (let key in paymentData) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = paymentData[key];
            form.appendChild(input);
        }

        return form;
    }

    // Process payment
    processPayment(userDetails, reportType) {
        try {
            // Validate user details
            if (!userDetails.fullName || !userDetails.email) {
                throw new Error('Please complete all required fields before proceeding with payment.');
            }

            // Show loading state
            this.showPaymentLoading();

            // Generate and submit payment form
            const paymentForm = this.generatePaymentForm(userDetails, reportType);
            document.body.appendChild(paymentForm);
            
            // Store payment details in localStorage for success page
            localStorage.setItem('paymentDetails', JSON.stringify({
                reportType: reportType,
                amount: reportType === 'professional' ? '99.00' : '199.00',
                userDetails: userDetails,
                timestamp: new Date().toISOString()
            }));

            // Submit form to PayFast
            paymentForm.submit();
            
        } catch (error) {
            console.error('Payment processing error:', error);
            this.hidePaymentLoading();
            alert('Payment Error: ' + error.message);
        }
    }

    // Show payment loading state
    showPaymentLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'paymentLoading';
        loadingDiv.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; justify-content: center; align-items: center;">
                <div style="background: white; padding: 2rem; border-radius: 8px; text-align: center;">
                    <div style="margin-bottom: 1rem;">Processing payment...</div>
                    <div style="border: 4px solid #f3f3f3; border-top: 4px solid #3498db; border-radius: 50%; width: 40px; height: 40px; animation: spin 2s linear infinite; margin: 0 auto;"></div>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        document.body.appendChild(loadingDiv);
    }

    // Hide payment loading state
    hidePaymentLoading() {
        const loadingDiv = document.getElementById('paymentLoading');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }
}

// Initialize PayFast integration
window.payFastIntegration = new PayFastIntegration();

// Payment button event handlers
document.addEventListener('DOMContentLoaded', function() {
    // Professional Report payment button
    const professionalBtn = document.getElementById('purchaseProfessionalReport');
    if (professionalBtn) {
        professionalBtn.addEventListener('click', function() {
            const userDetails = collectUserDetails();
            if (userDetails) {
                window.payFastIntegration.processPayment(userDetails, 'professional');
            }
        });
    }

    // Premium Package payment button
    const premiumBtn = document.getElementById('purchasePremiumPackage');
    if (premiumBtn) {
        premiumBtn.addEventListener('click', function() {
            const userDetails = collectUserDetails();
            if (userDetails) {
                window.payFastIntegration.processPayment(userDetails, 'premium');
            }
        });
    }
});

// Collect user details from form
function collectUserDetails() {
    const formData = new FormData(document.getElementById('taxCalculatorForm'));
    const userDetails = {};
    
    // Basic details
    userDetails.fullName = formData.get('fullName');
    userDetails.email = formData.get('emailAddress');
    userDetails.idNumber = formData.get('idNumber');
    
    // Tax calculation data
    userDetails.taxData = {
        basicSalary: parseFloat(formData.get('basicSalary')) || 0,
        bonus: parseFloat(formData.get('bonus')) || 0,
        overtime: parseFloat(formData.get('overtime')) || 0,
        pensionFund: parseFloat(formData.get('pensionFund')) || 0,
        medicalAid: parseFloat(formData.get('medicalAid')) || 0,
        // Add current calculation results
        grossIncome: window.currentCalculation?.grossIncome || 0,
        taxableIncome: window.currentCalculation?.taxableIncome || 0,
        taxPayable: window.currentCalculation?.taxPayable || 0,
        monthlyTax: window.currentCalculation?.monthlyTax || 0,
        effectiveRate: window.currentCalculation?.effectiveRate || 0,
        netIncome: window.currentCalculation?.netIncome || 0
    };
    
    // Language preference
    userDetails.language = localStorage.getItem('selectedLanguage') || 'en';
    
    // Validate required fields
    if (!userDetails.fullName || !userDetails.email) {
        alert('Please complete all required fields in the Personal Information section before proceeding with payment.');
        return null;
    }
    
    return userDetails;
}

