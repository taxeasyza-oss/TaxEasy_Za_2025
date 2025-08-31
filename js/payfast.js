// payfast-integration.js - COMPLETE PAYFAST PAYMENT SYSTEM
class PayFastIntegration {
    constructor() {
        // PayFast configuration - UPDATE WITH YOUR ACTUAL CREDENTIALS
        this.config = {
            merchantId: '10000100',  // Replace with your actual merchant ID
            merchantKey: '46f0cd694581a',  // Replace with your actual merchant key
            passPhrase: 'jt7NOE43FZPn',  // Replace with your actual passphrase (optional)
            testMode: true,  // Set to false for production
            
            // URLs - UPDATE WITH YOUR ACTUAL DOMAIN
            returnUrl: `${window.location.origin}/payment-return.html`,
            cancelUrl: `${window.location.origin}/payment-cancel.html`,
            notifyUrl: `${window.location.origin}/api/payfast-notify`,
            
            // PayFast endpoints
            paymentUrl: 'https://sandbox.payfast.co.za/eng/process',  // Use https://www.payfast.co.za/eng/process for production
            apiUrl: 'https://api.payfast.co.za'
        };
        
        this.init();
    }
    
    init() {
        console.log('PayFast integration initialized');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Listen for payment completion messages
        window.addEventListener('message', (event) => {
            if (event.origin === 'https://sandbox.payfast.co.za' || event.origin === 'https://www.payfast.co.za') {
                this.handlePaymentMessage(event.data);
            }
        });
    }
    
    generatePaymentForm(amount, itemName, userDetails = {}) {
        try {
            // Validate required data
            if (!amount || amount <= 0) {
                throw new Error('Invalid payment amount');
            }
            
            if (!userDetails.email) {
                throw new Error('Email address is required for payment');
            }
            
            // Collect tax calculation data for post-payment report generation
            const taxData = this.collectTaxCalculationData();
            
            // Generate unique payment ID
            const paymentId = this.generatePaymentId();
            
            // Prepare payment data
            const paymentData = {
                // Merchant details
                merchant_id: this.config.merchantId,
                merchant_key: this.config.merchantKey,
                
                // URLs
                return_url: this.config.returnUrl,
                cancel_url: this.config.cancelUrl,
                notify_url: this.config.notifyUrl,
                
                // Buyer details
                name_first: userDetails.firstName || this.extractFirstName(userDetails.fullName),
                name_last: userDetails.lastName || this.extractLastName(userDetails.fullName),
                email_address: userDetails.email,
                
                // Transaction details
                m_payment_id: paymentId,
                amount: amount.toFixed(2),
                item_name: itemName,
                item_description: `TaxEasy_ZA Professional Tax Report for ${new Date().getFullYear()} tax year`,
                
                // Custom data for post-payment processing
                custom_str1: btoa(JSON.stringify(taxData)), // Base64 encoded tax data
                custom_str2: btoa(JSON.stringify(userDetails)), // Base64 encoded user details
                custom_str3: 'professional_report',
                custom_str4: new Date().toISOString(),
                custom_str5: window.location.href,
                
                // Payment method (optional)
                payment_method: 'cc', // Credit card default
                
                // Subscription details (if needed for future recurring payments)
                subscription_type: 1, // One-time payment
                billing_date: new Date().toISOString().split('T')[0],
                recurring_amount: amount.toFixed(2),
                frequency: 3, // Monthly (if implementing subscription model later)
                cycles: 1 // One cycle for one-time payment
            };
            
            // Generate signature
            const signature = this.generateSignature(paymentData);
            paymentData.signature = signature;
            
            // Store payment data for verification
            this.storePaymentData(paymentId, {
                ...paymentData,
                taxData,
                userDetails,
                timestamp: Date.now()
            });
            
            // Submit payment form
            this.submitPaymentForm(paymentData);
            
            return paymentId;
            
        } catch (error) {
            console.error('Payment form generation error:', error);
            this.showPaymentError('Failed to initialize payment. Please try again.');
            return null;
        }
    }
    
    generateSignature(data) {
        try {
            // Create parameter string for signature generation
            const params = Object.keys(data)
                .filter(key => key !== 'signature' && data[key] !== '') // Exclude signature and empty values
                .sort() // Sort parameters alphabetically
                .map(key => `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}`)
                .join('&');
            
            // Add passphrase if configured
            const signatureString = this.config.passPhrase 
                ? `${params}&passphrase=${encodeURIComponent(this.config.passPhrase)}`
                : params;
            
            // For client-side, we'll send the string to be hashed server-side
            // In production, this should be done on the server for security
            return btoa(signatureString); // Base64 encode for now
            
        } catch (error) {
            console.error('Signature generation error:', error);
            return '';
        }
    }
    
    submitPaymentForm(paymentData) {
        try {
            // Create hidden form
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = this.config.paymentUrl;
            form.target = '_blank'; // Open in new tab
            form.style.display = 'none';
            
            // Add all payment data as hidden fields
            Object.keys(paymentData).forEach(key => {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = paymentData[key];
                form.appendChild(input);
            });
            
            // Add form to page and submit
            document.body.appendChild(form);
            
            // Show loading state
            this.showPaymentLoading();
            
            // Submit form
            form.submit();
            
            // Clean up
            setTimeout(() => {
                document.body.removeChild(form);
            }, 1000);
            
            // Set up payment monitoring
            this.monitorPaymentWindow();
            
        } catch (error) {
            console.error('Form submission error:', error);
            this.showPaymentError('Failed to redirect to payment gateway. Please try again.');
        }
    }
    
    monitorPaymentWindow() {
        // Monitor for payment completion via polling or postMessage
        const checkPaymentStatus = () => {
            // This would typically involve checking payment status with your backend
            // For now, we'll show instructions to the user
            this.showPaymentInstructions();
        };
        
        setTimeout(checkPaymentStatus, 3000);
    }
    
    handlePaymentMessage(data) {
        try {
            if (data.type === 'payment_complete') {
                this.handlePaymentSuccess(data);
            } else if (data.type === 'payment_cancelled') {
                this.handlePaymentCancelled(data);
            } else if (data.type === 'payment_failed') {
                this.handlePaymentFailed(data);
            }
        } catch (error) {
            console.error('Payment message handling error:', error);
        }
    }
    
    handlePaymentSuccess(data) {
        console.log('Payment successful:', data);
        
        // Hide loading state
        this.hidePaymentLoading();
        
        // Show success message
        this.showPaymentSuccess();
        
        // Generate and deliver professional report
        this.generateProfessionalReport(data.paymentId);
        
        // Update UI to show paid status
        this.updateUIForPaidUser();
        
        // Send analytics event
        this.trackPaymentSuccess(data);
    }
    
    handlePaymentCancelled(data) {
        console.log('Payment cancelled:', data);
        
        this.hidePaymentLoading();
        this.showPaymentCancelled();
    }
    
    handlePaymentFailed(data) {
        console.error('Payment failed:', data);
        
        this.hidePaymentLoading();
        this.showPaymentError('Payment failed. Please try again or contact support.');
    }
    
    collectTaxCalculationData() {
        try {
            // Collect all form data for report generation
            const formData = window.wizard ? window.wizard.collectAllFormData() : {};
            const taxResults = window.wizard ? window.wizard.taxResults : {};
            
            return {
                personalInfo: this.getPersonalInfo(),
                incomeData: this.getIncomeData(),
                deductionsData: this.getDeductionsData(),
                taxCalculation: taxResults,
                formData: formData,
                calculationDate: new Date().toISOString(),
                taxYear: '2025'
            };
            
        } catch (error) {
            console.error('Error collecting tax data:', error);
            return {};
        }
    }
    
    getPersonalInfo() {
        return {
            fullName: document.getElementById('fullName')?.value || '',
            idNumber: document.getElementById('idNumber')?.value || '',
            email: document.getElementById('email')?.value || '',
            age: document.getElementById('age')?.value || 'under65',
            taxYear: document.getElementById('taxYear')?.value || '2025'
        };
    }
    
    getIncomeData() {
        const incomeFields = [
            'basicSalary', 'bonus', 'commission', 'overtime',
            'travelAllowance', 'cellphoneAllowance', 'otherAllowances',
            'interestIncome', 'dividendIncome', 'rentalIncome'
        ];
        
        const incomeData = {};
        incomeFields.forEach(field => {
            const value = parseFloat(document.getElementById(field)?.value || 0);
            incomeData[field] = value;
        });
        
        return incomeData;
    }
    
    getDeductionsData() {
        const deductionFields = [
            'pensionFund', 'providentFund', 'retirementAnnuity', 'medicalAid',
            'medicalMembers', 'medicalDependants', 'additionalMedical', 'donations',
            'businessKm', 'fuelExpenses', 'vehicleMaintenance', 'tollsParking',
            'solarPV', 'solarWaterHeater', 'otherRenewable', 'homeOffice'
        ];
        
        const deductionsData = {};
        deductionFields.forEach(field => {
            const element = document.getElementById(field);
            if (element) {
                const value = element.type === 'number' 
                    ? parseFloat(element.value || 0)
                    : element.value || '';
                deductionsData[field] = value;
            }
        });
        
        // Include occupation-specific deductions
        const occupation = document.getElementById('occupation')?.value;
        if (occupation) {
            deductionsData.occupation = occupation;
            deductionsData.occupationSpecific = this.getOccupationSpecificDeductions();
        }
        
        return deductionsData;
    }
    
    getOccupationSpecificDeductions() {
        const occupationFields = [
            'softwareLicenses', 'hardwareUpgrades', 'certificationCosts', 'techSubscriptions',
            'medicalEquipment', 'continuingEducation', 'professionalInsurance', 'medicalJournals',
            'classroomSupplies', 'educationalMaterials', 'professionalDevelopment',
            'professionalSoftware', 'technicalEquipment', 'professionalBodyFees',
            'legalResearchTools', 'lawBooksUpdates', 'barCouncilFees'
        ];
        
        const occupationData = {};
        occupationFields.forEach(field => {
            const element = document.getElementById(field);
            if (element && element.value) {
                occupationData[field] = parseFloat(element.value || 0);
            }
        });
        
        return occupationData;
    }
    
    generatePaymentId() {
        const timestamp = Date.now().toString();
        const random = Math.random().toString(36).substring(2);
        return `TAX_${timestamp}_${random}`.toUpperCase();
    }
    
    extractFirstName(fullName) {
        if (!fullName) return '';
        return fullName.split(' ')[0] || '';
    }
    
    extractLastName(fullName) {
        if (!fullName) return '';
        const parts = fullName.split(' ');
        return parts.slice(1).join(' ') || parts[0] || '';
    }
    
    storePaymentData(paymentId, data) {
        try {
            const storageKey = `payment_${paymentId}`;
            localStorage.setItem(storageKey, JSON.stringify(data));
            
            // Also store in session storage as backup
            sessionStorage.setItem(storageKey, JSON.stringify(data));
            
        } catch (error) {
            console.error('Error storing payment data:', error);
        }
    }
    
    retrievePaymentData(paymentId) {
        try {
            const storageKey = `payment_${paymentId}`;
            const data = localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error retrieving payment data:', error);
            return null;
        }
    }
    
    generateProfessionalReport(paymentId) {
        try {
            const paymentData = this.retrievePaymentData(paymentId);
            if (!paymentData) {
                throw new Error('Payment data not found');
            }
            
            // Generate professional PDF report
            if (window.pdfGenerator) {
                window.pdfGenerator.generateProfessionalReport(
                    paymentData.taxData,
                    paymentData.userDetails
                ).then(pdfDoc => {
                    // Auto-download the report
                    pdfDoc.save(`TaxEasy_ZA_Professional_Report_${new Date().getFullYear()}.pdf`);
                    
                    // Also email if configured
                    this.emailReport(paymentData.userDetails.email, pdfDoc);
                });
            } else {
                console.error('PDF generator not available');
            }
            
        } catch (error) {
            console.error('Error generating professional report:', error);
            this.showReportError();
        }
    }
    
    emailReport(email, pdfDoc) {
        // This would typically be handled by your backend
        // For now, we'll just show a message
        console.log(`Report would be emailed to: ${email}`);
    }
    
    updateUIForPaidUser() {
        // Hide payment buttons and show paid status
        const paymentButtons = document.querySelectorAll('.payment-btn');
        paymentButtons.forEach(btn => {
            btn.textContent = 'Report Purchased ✓';
            btn.disabled = true;
            btn.classList.add('paid-status');
        });
        
        // Show premium features
        const premiumFeatures = document.querySelectorAll('.premium-feature');
        premiumFeatures.forEach(feature => {
            feature.classList.add('unlocked');
        });
    }
    
    // UI Helper Methods
    showPaymentLoading() {
        const loadingHTML = `
            <div id="payment-loading" style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                color: white;
                font-family: var(--font-family);
            ">
                <div style="text-align: center;">
                    <div style="width: 50px; height: 50px; border: 5px solid #ffffff30; border-top-color: #b8d200; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
                    <h3 style="margin: 0 0 10px 0;">Redirecting to PayFast...</h3>
                    <p style="margin: 0; opacity: 0.8;">Please complete your payment to receive your professional tax report.</p>
                </div>
            </div>
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    }
    
    hidePaymentLoading() {
        const loading = document.getElementById('payment-loading');
        if (loading) {
            loading.remove();
        }
    }
    
    showPaymentInstructions() {
        const instructionsHTML = `
            <div id="payment-instructions" style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 2rem;
                border-radius: 12px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                z-index: 10000;
                max-width: 400px;
                text-align: center;
                font-family: var(--font-family);
            ">
                <div style="color: #032e61; margin-bottom: 1rem;">
                    <h3 style="margin: 0 0 10px 0;">Complete Your Payment</h3>
                    <p style="margin: 0; color: #666;">A new window should have opened with PayFast. Complete your payment there to receive your professional tax report.</p>
                </div>
                <button onclick="this.parentElement.remove()" style="
                    background: #032e61;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 6px;
                    cursor: pointer;
                ">Got It</button>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', instructionsHTML);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            const instructions = document.getElementById('payment-instructions');
            if (instructions) {
                instructions.remove();
            }
        }, 10000);
    }
    
    showPaymentSuccess() {
        this.showMessage('Payment successful! Your professional tax report is being generated.', 'success');
    }
    
    showPaymentCancelled() {
        this.showMessage('Payment was cancelled. You can try again anytime.', 'warning');
    }
    
    showPaymentError(message) {
        this.showMessage(message || 'Payment failed. Please try again.', 'error');
    }
    
    showReportError() {
        this.showMessage('There was an issue generating your report. Please contact support.', 'error');
    }
    
    showMessage(message, type = 'info') {
        // Use the wizard's message system if available
        if (window.wizard && typeof window.wizard.showMessage === 'function') {
            window.wizard.showMessage(message, type);
            return;
        }
        
        // Fallback message display
        const messageHTML = `
            <div style="
                position: fixed;
                top: 2rem;
                right: 2rem;
                background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 10px 15px rgba(0,0,0,0.1);
                z-index: 10000;
                max-width: 400px;
                font-size: 0.875rem;
                font-family: var(--font-family);
            ">
                ${message}
            </div>
        `;
        
        const messageEl = document.createElement('div');
        messageEl.innerHTML = messageHTML;
        document.body.appendChild(messageEl.firstElementChild);
        
        setTimeout(() => {
            const msg = document.body.lastElementChild;
            if (msg && msg.style.position === 'fixed') {
                msg.remove();
            }
        }, 5000);
    }
    
    trackPaymentSuccess(data) {
        // Analytics tracking for successful payments
        if (typeof gtag !== 'undefined') {
            gtag('event', 'purchase', {
                transaction_id: data.paymentId,
                value: data.amount,
                currency: 'ZAR',
                items: [{
                    item_id: 'professional_report',
                    item_name: 'Professional Tax Report',
                    category: 'Tax Services',
                    quantity: 1,
                    price: data.amount
                }]
            });
        }
        
        // Custom analytics
        console.log('Payment Success Analytics:', {
            paymentId: data.paymentId,
            amount: data.amount,
            timestamp: new Date().toISOString()
        });
    }
    
    // Validation Methods
    validatePaymentData(data) {
        const required = ['merchant_id', 'merchant_key', 'amount', 'item_name'];
        const missing = required.filter(field => !data[field]);
        
        if (missing.length > 0) {
            throw new Error(`Missing required payment fields: ${missing.join(', ')}`);
        }
        
        if (parseFloat(data.amount) <= 0) {
            throw new Error('Amount must be greater than 0');
        }
        
        return true;
    }
    
    // Utility Methods
    formatAmount(amount) {
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: 2
        }).format(amount);
    }
}

// Initialize PayFast integration
document.addEventListener('DOMContentLoaded', () => {
    window.payfast = new PayFastIntegration();
});

export default PayFastIntegration;
