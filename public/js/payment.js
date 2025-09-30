// Payment Integration for TaxEasy ZA 2025
class PaymentHandler {
    constructor() {
        this.baseUrl = window.location.origin;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Basic report (free) - handled by this class
        const basicReportBtn = document.getElementById('downloadBasicReport');
        if (basicReportBtn) {
            basicReportBtn.addEventListener('click', () => this.generateBasicReport());
        }

        // Professional and Premium reports are handled by PayFast integration
        // No event listeners needed here to avoid conflicts
    }

    async generateBasicReport() {
        try {
            this.showLoading('downloadBasicReport', 'Generating Report...');

            const taxData = this.collectTaxData();
            const userInfo = this.collectUserInfo();

            // Check if client-side PDF generator is available
            if (typeof window.taxEasyPDFGenerator === 'undefined') {
                throw new Error('PDF generator not available');
            }

            // Initialize PDF generator if needed
            await window.taxEasyPDFGenerator.initialize();

            // Generate basic PDF report
            const pdfBlob = await window.taxEasyPDFGenerator.generateBasicReport(taxData, userInfo);

            // Download the PDF
            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `TaxEasy_ZA_Basic_Report_${new Date().getFullYear()}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            this.showSuccess('Basic report downloaded successfully!');

        } catch (error) {
            console.error('Basic report generation error:', error);
            this.showError('Failed to generate basic report. Please try again.');
        } finally {
            this.hideLoading('downloadBasicReport', 'Download Basic Report');
        }
    }

    async initiatePaidReport(reportType) {
        try {
            const userEmail = this.getUserEmail();
            if (!userEmail) {
                this.showError('Please enter your email address to proceed with payment.');
                return;
            }

            this.showLoading(`${reportType === 'professional' ? 'purchaseProfessionalReport' : 'purchasePremiumPackage'}`, 'Initiating Payment...');

            const taxData = this.collectTaxData();
            const userInfo = this.collectUserInfo();

            // Use PayFast integration directly
            if (typeof window.payFastIntegration === 'undefined') {
                throw new Error('PayFast integration not available');
            }

            const userDetails = {
                fullName: userInfo.fullName,
                email: userEmail,
                idNumber: userInfo.idNumber,
                taxData: taxData,
                language: localStorage.getItem('selectedLanguage') || 'en'
            };

            // Process payment using PayFast integration
            window.payFastIntegration.processPayment(userDetails, reportType);

        } catch (error) {
            console.error('Payment initiation error:', error);
            this.showError('Failed to initiate payment. Please try again.');
            this.hideLoading(`${reportType === 'professional' ? 'purchaseProfessionalReport' : 'purchasePremiumPackage'}`, 
                           reportType === 'professional' ? 'Purchase Professional Report' : 'Purchase Premium Package');
        }
    }

    collectTaxData() {
        // Collect all tax-related data from the form
        const formData = new FormData(document.querySelector('form') || document.body);
        const taxData = {};

        // Basic income data
        taxData.grossIncome = parseFloat(document.getElementById('basicSalary')?.value || 0) +
                             parseFloat(document.getElementById('bonus')?.value || 0) +
                             parseFloat(document.getElementById('overtime')?.value || 0) +
                             parseFloat(document.getElementById('travelAllowance')?.value || 0) +
                             parseFloat(document.getElementById('cellphoneAllowance')?.value || 0) +
                             parseFloat(document.getElementById('otherAllowances')?.value || 0) +
                             parseFloat(document.getElementById('interestIncome')?.value || 0) +
                             parseFloat(document.getElementById('dividendIncome')?.value || 0) +
                             parseFloat(document.getElementById('rentalIncome')?.value || 0);

        taxData.ageGroup = document.getElementById('age')?.value || 'under65';

        // Deductions
        taxData.retirementFunding = parseFloat(document.getElementById('pensionFund')?.value || 0) +
                                   parseFloat(document.getElementById('providentFund')?.value || 0) +
                                   parseFloat(document.getElementById('retirementAnnuity')?.value || 0);

        taxData.medicalAidContributions = parseFloat(document.getElementById('medicalAid')?.value || 0);
        taxData.medicalMembers = parseInt(document.getElementById('medicalMembers')?.value || 0);
        taxData.medicalDependants = parseInt(document.getElementById('medicalDependants')?.value || 0);

        // Additional deductions
        taxData.donations = parseFloat(document.getElementById('donations')?.value || 0);
        taxData.homeOffice = parseFloat(document.getElementById('homeOffice')?.value || 0);
        taxData.solarPV = parseFloat(document.getElementById('solarPV')?.value || 0);

        return taxData;
    }

    collectUserInfo() {
        return {
            fullName: document.getElementById('fullName')?.value || '',
            idNumber: document.getElementById('idNumber')?.value || '',
            ageGroup: document.getElementById('age')?.value || '',
            occupation: document.getElementById('occupation')?.value || '',
            email: this.getUserEmail()
        };
    }

    getUserEmail() {
        // Try to get email from various possible sources
        const emailInput = document.getElementById('email') || 
                          document.getElementById('userEmail') ||
                          document.querySelector('input[type="email"]');
        
        if (emailInput) {
            return emailInput.value;
        }

        // If no email field found, prompt user
        return prompt('Please enter your email address for the report:');
    }

    showLoading(buttonId, text) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = true;
            button.textContent = text;
            button.classList.add('loading');
        }
    }

    hideLoading(buttonId, originalText) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = false;
            button.textContent = originalText;
            button.classList.remove('loading');
        }
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            max-width: 300px;
            background: ${type === 'success' ? '#22c55e' : '#ef4444'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;

        document.body.appendChild(notification);

        // Remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }
}

// Initialize payment handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.paymentHandler = new PaymentHandler();
});

