// wizard-navigation.js - COMPLETE 5-PAGE WIZARD SYSTEM
class TaxWizard {
    constructor() {
        this.currentPage = 1;
        this.totalPages = 5;
        this.pageData = {};
        this.validationErrors = new Map();
        this.autoSaveInterval = null;
        
        this.init();
    }
    
    init() {
        console.log('Initializing TaxEasy_ZA Wizard...');
        
        this.setupPages();
        this.bindNavigationEvents();
        this.setupValidation();
        this.setupAutoSave();
        this.loadSavedProgress();
        this.showPage(1);
        
        console.log('Tax Wizard initialized successfully');
    }
    
    setupPages() {
        // Ensure all pages are hidden initially
        document.querySelectorAll('.wizard-page').forEach(page => {
            page.style.display = 'none';
            page.classList.remove('active');
        });
        
        // Setup occupation-specific fields
        this.setupOccupationFields();
        
        // Setup dynamic tooltips
        this.setupTooltips();
    }
    
    setupOccupationFields() {
        const occupationSelect = document.getElementById('occupation');
        const fieldsContainer = document.getElementById('occupationSpecificFields');
        
        if (!occupationSelect || !fieldsContainer) return;
        
        const occupationFields = {
            'IT Professional': [
                { id: 'softwareLicenses', label: 'Software Licenses', max: 25000, tooltip: 'Professional development software licenses' },
                { id: 'hardwareUpgrades', label: 'Hardware Upgrades', max: 30000, tooltip: 'Computer equipment for work purposes' },
                { id: 'certificationCosts', label: 'Certification Costs', max: 20000, tooltip: 'Professional certifications and training' },
                { id: 'techSubscriptions', label: 'Technical Subscriptions', max: 15000, tooltip: 'Online learning platforms, technical publications' }
            ],
            'Healthcare Worker': [
                { id: 'medicalEquipment', label: 'Medical Equipment', max: 50000, tooltip: 'Stethoscopes, medical devices, protective equipment' },
                { id: 'continuingEducation', label: 'Continuing Education', max: 30000, tooltip: 'Medical conferences, CPD courses' },
                { id: 'professionalInsurance', label: 'Professional Insurance', max: 40000, tooltip: 'Malpractice and professional indemnity insurance' },
                { id: 'medicalJournals', label: 'Medical Journals', max: 8000, tooltip: 'Subscriptions to medical publications' }
            ],
            'Educator': [
                { id: 'classroomSupplies', label: 'Classroom Supplies', max: 15000, tooltip: 'Educational materials purchased for classroom use' },
                { id: 'educationalMaterials', label: 'Educational Materials', max: 10000, tooltip: 'Books, teaching aids, software' },
                { id: 'professionalDevelopment', label: 'Professional Development', max: 20000, tooltip: 'Teaching courses and qualifications' },
                { id: 'homeOfficeEducation', label: 'Home Office (Education)', max: 8000, tooltip: 'Internet and phone for remote teaching' }
            ],
            'Engineer': [
                { id: 'professionalSoftware', label: 'Professional Software', max: 35000, tooltip: 'CAD, engineering software licenses' },
                { id: 'technicalEquipment', label: 'Technical Equipment', max: 25000, tooltip: 'Calculators, measuring devices, safety equipment' },
                { id: 'professionalBodyFees', label: 'Professional Body Fees', max: 12000, tooltip: 'ECSA registration and professional fees' },
                { id: 'technicalPublications', label: 'Technical Publications', max: 8000, tooltip: 'Engineering journals and technical books' }
            ],
            'Legal Professional': [
                { id: 'legalResearchTools', label: 'Legal Research Tools', max: 40000, tooltip: 'Legal databases, research subscriptions' },
                { id: 'professionalIndemnity', label: 'Professional Insurance', max: 50000, tooltip: 'Professional indemnity insurance' },
                { id: 'lawBooksUpdates', label: 'Law Books & Updates', max: 20000, tooltip: 'Legal publications and updates' },
                { id: 'barCouncilFees', label: 'Bar Council Fees', max: 15000, tooltip: 'Professional body memberships and fees' }
            ]
        };
        
        occupationSelect.addEventListener('change', (e) => {
            const selectedOccupation = e.target.value;
            fieldsContainer.innerHTML = '';
            
            if (selectedOccupation && occupationFields[selectedOccupation]) {
                const fields = occupationFields[selectedOccupation];
                const gridHTML = fields.map(field => `
                    <div class="input-group">
                        <label for="${field.id}">${field.label}</label>
                        <input type="number" id="${field.id}" name="${field.id}" 
                               placeholder="0.00" step="0.01" min="0" max="${field.max}">
                        <div class="tooltip-icon" data-tooltip="${field.id}_tooltip">?</div>
                        <div class="field-help">Max: R${field.max.toLocaleString()} - ${field.tooltip}</div>
                    </div>
                `).join('');
                
                fieldsContainer.innerHTML = `
                    <div class="form-grid">
                        ${gridHTML}
                    </div>
                `;
                
                // Add event listeners to new fields
                fields.forEach(field => {
                    const input = document.getElementById(field.id);
                    if (input) {
                        input.addEventListener('input', () => this.validateField(input));
                        input.addEventListener('input', debounce(updateLiveSummary, 300));
                    }
                });
            }
        });
    }
    
    setupTooltips(lang = 'en') {
        // Multi-lingual tooltip system using translation data
        const tooltips = {
            age_tooltip: translations[lang]?.age_tooltip || translations.en.age_tooltip,
            basic_salary_tooltip: translations[lang]?.basic_salary_tooltip || translations.en.basic_salary_tooltip,
            bonus_tooltip: translations[lang]?.bonus_tooltip || translations.en.bonus_tooltip,
            travel_allowance_tooltip: translations[lang]?.travel_allowance_tooltip || translations.en.travel_allowance_tooltip,
            pension_tooltip: translations[lang]?.pension_tooltip || translations.en.pension_tooltip,
            ra_tooltip: translations[lang]?.ra_tooltip || translations.en.ra_tooltip,
            medical_aid_tooltip: translations[lang]?.medical_aid_tooltip || translations.en.medical_aid_tooltip,
            solar_pv_tooltip: translations[lang]?.solar_pv_tooltip || translations.en.solar_pv_tooltip,
            home_office_tooltip: translations[lang]?.home_office_tooltip || translations.en.home_office_tooltip,
            occupation_tooltip: translations[lang]?.occupation_tooltip || translations.en.occupation_tooltip
        };
        
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.id = 'dynamic-tooltip';
        tooltip.className = 'tooltip-popup';
        tooltip.style.cssText = `
            position: absolute;
            background: #1f2937;
            color: #fff;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 13px;
            line-height: 1.4;
            max-width: 280px;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            display: none;
        `;
        document.body.appendChild(tooltip);
        
        // Tooltip event handlers
        document.addEventListener('mouseover', (e) => {
            const icon = e.target.closest('.tooltip-icon');
            if (!icon) return;
            
            const tooltipKey = icon.dataset.tooltip;
            const content = tooltips[tooltipKey];
            
            if (content) {
                tooltip.innerHTML = content;
                tooltip.style.display = 'block';
                tooltip.style.opacity = '1';
                
                const rect = icon.getBoundingClientRect();
                tooltip.style.left = `${rect.left + window.scrollX - 140}px`;
                tooltip.style.top = `${rect.bottom + window.scrollY + 8}px`;
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.tooltip-icon')) {
                tooltip.style.opacity = '0';
                setTimeout(() => {
                    tooltip.style.display = 'none';
                }, 300);
            }
        });
    }
    
    bindNavigationEvents() {
        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousPage());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextPage());
        }
        
        // Page dots navigation
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const targetPage = index + 1;
                if (this.canNavigateToPage(targetPage)) {
                    this.showPage(targetPage);
                }
            });
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    this.previousPage();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    this.nextPage();
                }
            }
        });
    }
    
    setupValidation() {
        // Real-time validation for all input fields
        document.addEventListener('input', (e) => {
            if (e.target.matches('input, select')) {
                this.validateField(e.target);
            }
        });
        
        document.addEventListener('blur', (e) => {
            if (e.target.matches('input, select')) {
                this.validateField(e.target, true);
            }
        }, true);
    }
    
    setupAutoSave() {
        // Auto-save progress every 30 seconds
        this.autoSaveInterval = setInterval(() => {
            this.saveProgress();
        }, 30000);
        
        // Save on page visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.saveProgress();
            }
        });
        
        // Save before page unload
        window.addEventListener('beforeunload', () => {
            this.saveProgress();
        });
    }
    
    showPage(pageNumber) {
        if (pageNumber < 1 || pageNumber > this.totalPages) return;
        
        // Hide all pages
        document.querySelectorAll('.wizard-page').forEach(page => {
            page.style.display = 'none';
            page.classList.remove('active');
        });
        
        // Show target page
        const targetPage = document.getElementById(`page-${pageNumber}`);
        if (targetPage) {
            targetPage.style.display = 'block';
            targetPage.classList.add('active');
            
            this.currentPage = pageNumber;
            this.updateProgressIndicator();
            this.updateNavigationButtons();
            this.updateProgressSteps();
            this.updateTaxTip();
            
            // Focus first input on page
            const firstInput = targetPage.querySelector('input, select');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    nextPage() {
        if (!this.validateCurrentPage()) {
            this.showValidationSummary();
            return;
        }
        
        if (this.currentPage < this.totalPages) {
            this.savePageData();
            this.showPage(this.currentPage + 1);
        } else {
            // Final page - calculate and show summary
            this.calculateFinalTax();
        }
    }
    
    previousPage() {
        if (this.currentPage > 1) {
            this.showPage(this.currentPage - 1);
        }
    }
    
    validateCurrentPage() {
        const currentPageElement = document.getElementById(`page-${this.currentPage}`);
        const requiredFields = currentPageElement.querySelectorAll('[required]');
        
        let isValid = true;
        const errors = [];
        
        requiredFields.forEach(field => {
            if (!this.validateField(field, true)) {
                isValid = false;
                errors.push({
                    field: field.name || field.id,
                    message: this.getFieldError(field)
                });
            }
        });
        
        // Page-specific validation
        if (this.currentPage === 1) {
            isValid = this.validatePersonalInfo() && isValid;
        } else if (this.currentPage === 3) {
            isValid = this.validateRetirementContributions() && isValid;
        }
        
        return isValid;
    }
    
    validatePersonalInfo() {
        const fullName = document.getElementById('fullName');
        const idNumber = document.getElementById('idNumber');
        
        if (!fullName.value.trim()) {
            this.showFieldError(fullName, 'Full name is required');
            return false;
        }
        
        if (!idNumber.value.trim()) {
            this.showFieldError(idNumber, 'ID or Passport number is required');
            return false;
        }
        
        // Validate South African ID format
        const idValue = idNumber.value.trim();
        if (idValue.length === 13 && /^\d{13}$/.test(idValue)) {
            if (!this.validateSouthAfricanId(idValue)) {
                this.showFieldError(idNumber, 'Invalid South African ID number');
                return false;
            }
        } else if (idValue.length < 6 || idValue.length > 20) {
            this.showFieldError(idNumber, 'Invalid ID/Passport format');
            return false;
        }
        
        return true;
    }
    
    validateRetirementContributions() {
        const pension = parseFloat(document.getElementById('pensionFund')?.value || 0);
        const provident = parseFloat(document.getElementById('providentFund')?.value || 0);
        const ra = parseFloat(document.getElementById('retirementAnnuity')?.value || 0);
        
        const totalRetirement = pension + provident + ra;
        const maxRetirement = 350000;
        
        if (totalRetirement > maxRetirement) {
            this.showMessage(`Total retirement contributions (R${totalRetirement.toLocaleString()}) exceed the annual limit of R${maxRetirement.toLocaleString()}`, 'error');
            return false;
        }
        
        return true;
    }
    
    validateSouthAfricanId(idNumber) {
        // Luhn algorithm for SA ID validation
        let sum = 0;
        let alternate = false;
        
        for (let i = idNumber.length - 1; i >= 0; i--) {
            let n = parseInt(idNumber.charAt(i));
            
            if (alternate) {
                n *= 2;
                if (n > 9) {
                    n = (n % 10) + 1;
                }
            }
            
            sum += n;
            alternate = !alternate;
        }
        
        return (sum % 10) === 0;
    }
    
    validateField(field, showError = false) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Required field validation
        if (field.hasAttribute('required') && !value) {
            if (showError) {
                this.showFieldError(field, 'This field is required');
            }
            return false;
        }
        
        // Number field validation
        if (field.type === 'number' && value) {
            const numValue = parseFloat(value);
            const min = parseFloat(field.min);
            const max = parseFloat(field.max);
            
            if (isNaN(numValue)) {
                if (showError) {
                    this.showFieldError(field, 'Please enter a valid number');
                }
                return false;
            }
            
            if (!isNaN(min) && numValue < min) {
                if (showError) {
                    this.showFieldError(field, `Value must be at least ${min}`);
                }
                return false;
            }
            
            if (!isNaN(max) && numValue > max) {
                if (showError) {
                    this.showFieldError(field, `Value cannot exceed ${max.toLocaleString()}`);
                }
                return false;
            }
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                if (showError) {
                    this.showFieldError(field, 'Please enter a valid email address');
                }
                return false;
            }
        }
        
        // Field is valid
        field.classList.add('success');
        return true;
    }
    
    showFieldError(field, message) {
        field.classList.add('error');
        field.classList.remove('success');
        
        // Remove existing error message
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Add new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.8125rem;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        `;
        errorDiv.innerHTML = `<span>⚠</span> ${message}`;
        
        field.parentNode.appendChild(errorDiv);
        
        // Store error
        this.validationErrors.set(field.id, message);
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorMessage = field.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
        
        this.validationErrors.delete(field.id);
    }
    
    getFieldError(field) {
        return this.validationErrors.get(field.id) || 'Validation error';
    }
    
    showValidationSummary() {
        if (this.validationErrors.size === 0) return;
        
        const errors = Array.from(this.validationErrors.entries());
        const errorList = errors.map(([field, message]) => `• ${message}`).join('\n');
        
        this.showMessage(`Please fix the following errors:\n\n${errorList}`, 'error');
    }
    
    updateProgressIndicator() {
        const progress = (this.currentPage / this.totalPages) * 100;
        const progressBar = document.getElementById('progress-bar');
        const stepIndicator = document.getElementById('step-indicator');
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (stepIndicator) {
            stepIndicator.textContent = `Step ${this.currentPage} of ${this.totalPages}`;
        }
    }
    
    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
            prevBtn.style.opacity = this.currentPage === 1 ? '0.5' : '1';
        }
        
        if (nextBtn) {
            if (this.currentPage === this.totalPages) {
                nextBtn.textContent = 'Calculate Tax';
                nextBtn.classList.add('btn-primary');
                nextBtn.classList.remove('nav-next');
            } else {
                nextBtn.textContent = 'Next →';
                nextBtn.classList.remove('btn-primary');
                nextBtn.classList.add('nav-next');
            }
        }
    }
    
    updateProgressSteps() {
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            
            step.classList.remove('active', 'completed');
            
            if (stepNumber < this.currentPage) {
                step.classList.add('completed');
            } else if (stepNumber === this.currentPage) {
                step.classList.add('active');
            }
        });
        
        // Update dots
        document.querySelectorAll('.dot').forEach((dot, index) => {
            const pageNumber = index + 1;
            
            dot.classList.remove('active', 'completed');
            
            if (pageNumber < this.currentPage) {
                dot.classList.add('completed');
            } else if (pageNumber === this.currentPage) {
                dot.classList.add('active');
            }
        });
    }
    
    updateTaxTip() {
        const tips = [
            'Complete all sections for the most accurate tax calculation.',
            'Include all income sources from your IRP5 certificates.',
            'Don\'t forget to claim all eligible deductions to reduce your tax.',
            'Occupation-specific deductions can significantly reduce your tax liability.',
            'Review your calculation carefully before generating your report.'
        ];
        
        const tipElement = document.getElementById('currentTip');
        if (tipElement) {
            const tip = tips[this.currentPage - 1] || tips[0];
            tipElement.querySelector('p').textContent = tip;
        }
    }
    
    savePageData() {
        const currentPageElement = document.getElementById(`page-${this.currentPage}`);
        const inputs = currentPageElement.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            this.pageData[input.id] = input.value;
        });
    }
    
    saveProgress() {
        this.savePageData();
        
        const progressData = {
            currentPage: this.currentPage,
            pageData: this.pageData,
            timestamp: Date.now()
        };
        
        try {
            localStorage.setItem('taxeasy_progress', JSON.stringify(progressData));
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }
    
    loadSavedProgress() {
        try {
            const saved = localStorage.getItem('taxeasy_progress');
            if (saved) {
                const progressData = JSON.parse(saved);
                
                // Check if data is recent (within 7 days)
                const isRecent = (Date.now() - progressData.timestamp) < (7 * 24 * 60 * 60 * 1000);
                
                if (isRecent && progressData.pageData) {
                    // Restore form data
                    Object.keys(progressData.pageData).forEach(fieldId => {
                        const field = document.getElementById(fieldId);
                        if (field) {
                            field.value = progressData.pageData[fieldId];
                        }
                    });
                    
                    this.pageData = progressData.pageData;
                    
                    // Show option to continue from saved page
                    if (progressData.currentPage > 1) {
                        this.showMessage(
                            `Found saved progress from ${new Date(progressData.timestamp).toLocaleDateString()}. Continue from Step ${progressData.currentPage}?`,
                            'info',
                            [
                                {
                                    text: 'Continue',
                                    action: () => this.showPage(progressData.currentPage)
                                },
                                {
                                    text: 'Start Over',
                                    action: () => this.restartCalculator()
                                }
                            ]
                        );
                    }
                }
            }
        } catch (error) {
            console.error('Error loading saved progress:', error);
        }
    }
    
    calculateFinalTax() {
        try {
            this.savePageData();
            
            const formData = this.collectAllFormData();
            const taxResult = window.taxEngine.calculateTax(
                formData.grossIncome,
                formData.deductions
            );
            
            this.displayTaxSummary(taxResult);
            
        } catch (error) {
            console.error('Error calculating tax:', error);
            this.showMessage('Error calculating tax. Please check your input values.', 'error');
        }
    }
    
    collectAllFormData() {
        const formData = {
            grossIncome: 0,
            deductions: {}
        };
        
        // Income fields
        const incomeFields = [
            'basicSalary', 'bonus', 'commission', 'overtime',
            'travelAllowance', 'cellphoneAllowance', 'otherAllowances',
            'interestIncome', 'dividendIncome', 'rentalIncome'
        ];
        
        incomeFields.forEach(fieldId => {
            const value = parseFloat(document.getElementById(fieldId)?.value || 0);
            formData.grossIncome += value;
        });
        
        // Deductions
        formData.deductions = {
            age: document.getElementById('age')?.value || 'under65',
            retirementFunding: (
                parseFloat(document.getElementById('pensionFund')?.value || 0) +
                parseFloat(document.getElementById('providentFund')?.value || 0) +
                parseFloat(document.getElementById('retirementAnnuity')?.value || 0)
            ),
            medicalAidContributions: parseFloat(document.getElementById('medicalAid')?.value || 0),
            medicalMembers: parseInt(document.getElementById('medicalMembers')?.value || 0),
            medicalDependants: parseInt(document.getElementById('medicalDependants')?.value || 0),
            otherDeductions: this.calculateOtherDeductions()
        };
        
        return formData;
    }
    
    calculateOtherDeductions() {
        const deductionFields = [
            'donations', 'fuelExpenses', 'vehicleMaintenance', 'tollsParking',
            'homeOffice', 'solarPV', 'solarWaterHeater', 'otherRenewable',
            // Occupation-specific fields (dynamic)
            'softwareLicenses', 'hardwareUpgrades', 'certificationCosts', 'techSubscriptions',
            'medicalEquipment', 'continuingEducation', 'professionalInsurance', 'medicalJournals',
            'classroomSupplies', 'educationalMaterials', 'professionalDevelopment',
            'professionalSoftware', 'technicalEquipment', 'professionalBodyFees', 'technicalPublications',
            'legalResearchTools', 'professionalIndemnity', 'lawBooksUpdates', 'barCouncilFees'
        ];
        
        return deductionFields.reduce((total, fieldId) => {
            const field = document.getElementById(fieldId);
            if (field) {
                return total + (parseFloat(field.value) || 0);
            }
            return total;
        }, 0);
    }
    
    displayTaxSummary(taxResult) {
        // Update summary display elements
        document.getElementById('summaryGrossIncome').textContent = `R${taxResult.grossIncome.toLocaleString()}`;
        document.getElementById('summaryDeductions').textContent = `R${taxResult.totalDeductions.toLocaleString()}`;
        document.getElementById('summaryTaxableIncome').textContent = `R${taxResult.taxableIncome.toLocaleString()}`;
        document.getElementById('summaryTaxPayable').textContent = `R${taxResult.finalTax.toLocaleString()}`;
        document.getElementById('summaryMonthlyTax').textContent = `R${taxResult.monthlyTax.toLocaleString()}`;
        document.getElementById('summaryEffectiveRate').textContent = `${taxResult.effectiveRate}%`;
        
        // Display bracket breakdown
        const breakdownContainer = document.getElementById('bracketBreakdown');
        if (breakdownContainer && taxResult.bracketBreakdown) {
            const breakdownHTML = taxResult.bracketBreakdown.map(bracket => `
                <div class="bracket-item">
                    <div class="bracket-range">${bracket.range}</div>
                    <div class="bracket-rate">${bracket.rate}</div>
                    <div class="bracket-tax">R${bracket.tax.toLocaleString()}</div>
                </div>
            `).join('');
            
            breakdownContainer.innerHTML = `
                <div class="bracket-header">
                    <div>Income Range</div>
                    <div>Rate</div>
                    <div>Tax</div>
                </div>
                ${breakdownHTML}
            `;
        }
        
        // Store results for report generation
        this.taxResults = taxResult;
    }
    
    canNavigateToPage(pageNumber) {
        // Allow navigation to completed pages or next page
        return pageNumber <= this.currentPage + 1;
    }
    
    restartCalculator() {
        // Clear all form data
        document.querySelectorAll('input').forEach(input => {
            input.value = '';
            input.classList.remove('error', 'success');
        });
        
        document.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0;
        });
        
        // Clear saved progress
        sessionStorage.removeItem('taxeasy_progress');
        
        // Reset wizard state
        this.currentPage = 1;
        this.pageData = {};
        this.validationErrors.clear();
        
        // Show first page
        this.showPage(1);
        
        this.showMessage('Calculator has been reset. Starting fresh!', 'success');
    }
    
    showMessage(message, type = 'info', actions = []) {
        // Create and show toast message
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.style.cssText = `
            position: fixed;
            top: 2rem;
            right: 2rem;
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 10px 15px rgba(0,0,0,0.1);
            z-index: 1000;
            max-width: 400px;
            font-size: 0.875rem;
            line-height: 1.4;
        `;
        
        const messageHTML = `
            <div style="margin-bottom: ${actions.length > 0 ? '1rem' : '0'};">
                ${message.replace(/\n/g, '<br>')}
            </div>
            ${actions.length > 0 ? `
                <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
                    ${actions.map(action => `
                        <button onclick="${action.action.name}()" style="
                            background: rgba(255,255,255,0.2);
                            border: none;
                            color: white;
                            padding: 0.5rem 1rem;
                            border-radius: 0.25rem;
                            cursor: pointer;
                            font-size: 0.8125rem;
                        ">${action.text}</button>
                    `).join('')}
                </div>
            ` : ''}
        `;
        
        toast.innerHTML = messageHTML;
        document.body.appendChild(toast);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 5000);
        
        // Make actions available globally
        actions.forEach(action => {
            window[action.action.name] = action.action;
        });
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize wizard when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.wizard = new TaxWizard();
});

window.TaxWizard = TaxWizard;
