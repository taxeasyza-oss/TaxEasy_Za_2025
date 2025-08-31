// pdf-generator-enhanced.js - PROFESSIONAL PDF REPORT GENERATOR
class TaxReportPDF {
    constructor() {
        this.jsPDF = window.jspdf?.jsPDF;
        this.brandColors = {
            primary: '#032e61',
            accent: '#b8d200',
            text: '#333333',
            lightGray: '#f8f9fa',
            mediumGray: '#6c757d'
        };
        
        this.init();
    }
    
    init() {
        if (!this.jsPDF) {
            console.warn('jsPDF not loaded. PDF generation will not be available.');
            return;
        }
        
        console.log('Professional PDF Generator initialized');
    }
    
    async generateBasicReport(taxData, userInfo) {
        try {
            const doc = new this.jsPDF('p', 'mm', 'a4');
            
            // Add basic content
            this.addBasicHeader(doc);
            this.addBasicUserInfo(doc, userInfo);
            this.addBasicTaxSummary(doc, taxData);
            this.addWatermark(doc);
            this.addBasicFooter(doc);
            
            // Auto-download
            const fileName = `TaxEasy_ZA_Basic_Report_${new Date().getFullYear()}.pdf`;
            doc.save(fileName);
            
            return doc;
            
        } catch (error) {
            console.error('Error generating basic report:', error);
            this.showError('Failed to generate basic report');
            return null;
        }
    }
    
    async generateProfessionalReport(taxData, userInfo) {
        try {
            const doc = new this.jsPDF('p', 'mm', 'a4');
            let yPos = 20;
            
            // Professional report content
            yPos = this.addProfessionalHeader(doc, yPos);
            yPos = this.addExecutiveSummary(doc, taxData, yPos);
            yPos = this.addPersonalDetails(doc, userInfo, yPos);
            yPos = this.addIncomeBreakdown(doc, taxData, yPos);
            yPos = this.addDeductionsAnalysis(doc, taxData, yPos);
            yPos = this.addTaxCalculationDetails(doc, taxData, yPos);
            
            // Add new page for additional content
            doc.addPage();
            yPos = 20;
            
            yPos = this.addTaxOptimizationAdvice(doc, taxData, yPos);
            yPos = this.addComplianceChecklist(doc, taxData, yPos);
            yPos = this.addSARSSubmissionGuide(doc, yPos);
            yPos = this.addDisclaimer(doc, yPos);
            this.addProfessionalFooter(doc);
            
            // Auto-download
            const fileName = `TaxEasy_ZA_Professional_Report_${new Date().getFullYear()}.pdf`;
            doc.save(fileName);
            
            return doc;
            
        } catch (error) {
            console.error('Error generating professional report:', error);
            this.showError('Failed to generate professional report');
            return null;
        }
    }
    
    addBasicHeader(doc) {
        // Simple header for free version
        doc.setFillColor(3, 46, 97);
        doc.rect(0, 0, 210, 25, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text('TaxEasy_ZA - Basic Tax Report', 20, 17);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text('2025 Tax Year', 160, 17);
        
        doc.setTextColor(0, 0, 0);
    }
    
    addProfessionalHeader(doc, yPos) {
        // Professional branded header
        doc.setFillColor(3, 46, 97);
        doc.rect(0, 0, 210, 30, 'F');
        
        // Logo area
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont('helvetica', 'bold');
        doc.text('TaxEasy_ZA', 20, 20);
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('Professional Tax Calculation Services', 20, 26);
        
        // Report type badge
        doc.setFillColor(184, 210, 0);
        doc.rect(140, 8, 55, 14, 'F');
        doc.setTextColor(3, 46, 97);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('PROFESSIONAL REPORT', 142, 17);
        
        doc.setTextColor(0, 0, 0);
        return 40;
    }
    
    addBasicUserInfo(doc, userInfo) {
        let yPos = 40;
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Personal Information', 20, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Name: ${userInfo.fullName || 'Not provided'}`, 20, yPos);
        yPos += 6;
        doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, yPos);
        yPos += 6;
        doc.text(`Tax Year: 2025 (1 Mar 2024 - 28 Feb 2025)`, 20, yPos);
    }
    
    addPersonalDetails(doc, userInfo, yPos) {
        yPos += 10;
        
        // Section header
        doc.setFillColor(248, 249, 250);
        doc.rect(20, yPos - 5, 170, 8, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Personal Details', 22, yPos);
        yPos += 12;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const personalData = [
            ['Full Name:', userInfo.fullName || 'Not provided'],
            ['ID/Passport:', userInfo.idNumber || 'Not provided'],
            ['Email:', userInfo.email || 'Not provided'],
            ['Age Group:', this.formatAgeGroup(userInfo.age)],
            ['Report Generated:', new Date().toLocaleDateString()],
            ['Tax Year:', '2025 (1 March 2024 - 28 February 2025)']
        ];
        
        personalData.forEach(([label, value]) => {
            doc.text(label, 25, yPos);
            doc.text(value, 80, yPos);
            yPos += 6;
        });
        
        return yPos + 5;
    }
    
    addExecutiveSummary(doc, taxData, yPos) {
        yPos += 5;
        
        // Executive Summary Box
        doc.setFillColor(3, 46, 97);
        doc.rect(20, yPos - 5, 170, 35, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Executive Summary', 25, yPos + 5);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const taxResult = this.calculateTaxSummary(taxData);
        
        // Summary data in white text
        const summaryItems = [
            [`Gross Income: R${taxResult.grossIncome.toLocaleString()}`, `Tax Payable: R${taxResult.taxPayable.toLocaleString()}`],
            [`Deductions: R${taxResult.deductions.toLocaleString()}`, `Effective Rate: ${taxResult.effectiveRate}%`],
            [`Taxable Income: R${taxResult.taxableIncome.toLocaleString()}`, `Monthly Tax: R${taxResult.monthlyTax.toLocaleString()}`]
        ];
        
        let summaryY = yPos + 12;
        summaryItems.forEach(([left, right]) => {
            doc.text(left, 25, summaryY);
            doc.text(right, 110, summaryY);
            summaryY += 6;
        });
        
        doc.setTextColor(0, 0, 0);
        return yPos + 40;
    }
    
    addBasicTaxSummary(doc, taxData) {
        let yPos = 70;
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Tax Summary', 20, yPos);
        yPos += 10;
        
        const taxResult = this.calculateTaxSummary(taxData);
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const summaryData = [
            ['Gross Income:', `R${taxResult.grossIncome.toLocaleString()}`],
            ['Total Deductions:', `R${taxResult.deductions.toLocaleString()}`],
            ['Taxable Income:', `R${taxResult.taxableIncome.toLocaleString()}`],
            ['Tax Payable:', `R${taxResult.taxPayable.toLocaleString()}`],
            ['Effective Tax Rate:', `${taxResult.effectiveRate}%`],
            ['Monthly Tax:', `R${taxResult.monthlyTax.toLocaleString()}`]
        ];
        
        summaryData.forEach(([label, value]) => {
            doc.text(label, 20, yPos);
            doc.text(value, 100, yPos);
            yPos += 6;
        });
    }
    
    addIncomeBreakdown(doc, taxData, yPos) {
        yPos += 10;
        
        // Section header
        doc.setFillColor(248, 249, 250);
        doc.rect(20, yPos - 5, 170, 8, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Income Breakdown', 22, yPos);
        yPos += 12;
        
        const incomeData = this.getIncomeBreakdown(taxData);
        
        // Table headers
        doc.setFillColor(220, 220, 220);
        doc.rect(20, yPos - 3, 170, 6, 'F');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Income Source', 22, yPos);
        doc.text('Amount (R)', 140, yPos);
        doc.text('% of Total', 170, yPos);
        yPos += 8;
        
        doc.setFont('helvetica', 'normal');
        
        incomeData.forEach(([source, amount, percentage]) => {
            if (amount > 0) {
                doc.text(source, 22, yPos);
                doc.text(amount.toLocaleString(), 140, yPos);
                doc.text(`${percentage.toFixed(1)}%`, 170, yPos);
                yPos += 5;
            }
        });
        
        return yPos + 5;
    }
    
    addDeductionsAnalysis(doc, taxData, yPos) {
        yPos += 10;
        
        // Section header
        doc.setFillColor(248, 249, 250);
        doc.rect(20, yPos - 5, 170, 8, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Deductions Analysis', 22, yPos);
        yPos += 12;
        
        const deductionsData = this.getDeductionsBreakdown(taxData);
        
        // Table headers
        doc.setFillColor(220, 220, 220);
        doc.rect(20, yPos - 3, 170, 6, 'F');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Deduction Type', 22, yPos);
        doc.text('Amount (R)', 120, yPos);
        doc.text('Tax Saving', 150, yPos);
        doc.text('Status', 175, yPos);
        yPos += 8;
        
        doc.setFont('helvetica', 'normal');
        
        deductionsData.forEach(([type, amount, saving, status]) => {
            if (amount > 0) {
                doc.text(type, 22, yPos);
                doc.text(amount.toLocaleString(), 120, yPos);
                doc.text(saving.toLocaleString(), 150, yPos);
                doc.text(status, 175, yPos);
                yPos += 5;
            }
        });
        
        return yPos + 5;
    }
    
    addTaxCalculationDetails(doc, taxData, yPos) {
        yPos += 10;
        
        // Section header
        doc.setFillColor(248, 249, 250);
        doc.rect(20, yPos - 5, 170, 8, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Tax Calculation Details (SARS 2025 Brackets)', 22, yPos);
        yPos += 12;
        
        const brackets = this.getTaxBracketBreakdown(taxData);
        
        // Table headers
        doc.setFillColor(220, 220, 220);
        doc.rect(20, yPos - 3, 170, 6, 'F');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('Income Range', 22, yPos);
        doc.text('Rate', 80, yPos);
        doc.text('Taxable Amount', 110, yPos);
        doc.text('Tax', 150, yPos);
        yPos += 8;
        
        doc.setFont('helvetica', 'normal');
        
        brackets.forEach(bracket => {
            doc.text(bracket.range, 22, yPos);
            doc.text(bracket.rate, 80, yPos);
            doc.text(bracket.taxableAmount.toLocaleString(), 110, yPos);
            doc.text(bracket.tax.toLocaleString(), 150, yPos);
            yPos += 5;
        });
        
        return yPos + 10;
    }
    
    addTaxOptimizationAdvice(doc, taxData, yPos) {
        yPos += 5;
        
        doc.setFillColor(184, 210, 0);
        doc.rect(20, yPos - 5, 170, 8, 'F');
        doc.setTextColor(3, 46, 97);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Tax Optimization Recommendations', 22, yPos);
        yPos += 12;
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const recommendations = this.generateOptimizationRecommendations(taxData);
        
        recommendations.forEach(recommendation => {
            // Recommendation header
            doc.setFont('helvetica', 'bold');
            doc.text(`• ${recommendation.title}`, 25, yPos);
            yPos += 5;
            
            doc.setFont('helvetica', 'normal');
            doc.text(recommendation.description, 30, yPos);
            yPos += 4;
            
            if (recommendation.saving) {
                doc.setFont('helvetica', 'bold');
                doc.text(`Potential saving: R${recommendation.saving.toLocaleString()}`, 30, yPos);
                yPos += 6;
                doc.setFont('helvetica', 'normal');
            }
            
            yPos += 3;
        });
        
        return yPos;
    }
    
    addComplianceChecklist(doc, taxData, yPos) {
        yPos += 10;
        
        doc.setFillColor(248, 249, 250);
        doc.rect(20, yPos - 5, 170, 8, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('SARS Compliance Checklist', 22, yPos);
        yPos += 12;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const checklist = [
            'Ensure all IRP5 certificates are included in your return',
            'Keep supporting documentation for all deductions claimed',
            'Submit your return by the deadline (31 Oct 2025 for non-provisional taxpayers)',
            'Pay any outstanding tax by the due date to avoid penalties and interest',
            'Consider provisional tax payments if your liability exceeds R1,000',
            'Maintain records for at least 5 years as required by SARS'
        ];
        
        checklist.forEach(item => {
            doc.text(`✓ ${item}`, 25, yPos);
            yPos += 6;
        });
        
        return yPos + 5;
    }
    
    addSARSSubmissionGuide(doc, yPos) {
        yPos += 10;
        
        doc.setFillColor(248, 249, 250);
        doc.rect(20, yPos - 5, 170, 8, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('SARS eFiling Submission Guide', 22, yPos);
        yPos += 12;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        const steps = [
            '1. Log into SARS eFiling at www.sarsefiling.co.za',
            '2. Select "Income Tax Return" for individuals (ITR12)',
            '3. Complete all relevant sections with data from this report',
            '4. Upload supporting documents if required',
            '5. Review and submit your return',
            '6. Print and keep a copy of your submitted return'
        ];
        
        steps.forEach(step => {
            doc.text(step, 25, yPos);
            yPos += 6;
        });
        
        return yPos + 5;
    }
    
    addWatermark(doc) {
        // Add "FREE VERSION" watermark
        doc.saveGraphicsState();
        doc.setGState(new doc.GState({opacity: 0.1}));
        doc.setTextColor(200, 200, 200);
        doc.setFontSize(50);
        doc.setFont('helvetica', 'bold');
        
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // Rotate and center the watermark
        doc.text('FREE VERSION', pageWidth / 2, pageHeight / 2, {
            angle: 45,
            align: 'center',
            baseline: 'middle'
        });
        
        doc.restoreGraphicsState();
    }
    
    addDisclaimer(doc, yPos) {
        yPos += 15;
        
        doc.setFillColor(255, 240, 240);
        doc.rect(20, yPos - 5, 170, 25, 'F');
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Important Disclaimer', 22, yPos);
        yPos += 6;
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        
        const disclaimerText = [
            'This report provides tax calculations based on current SARS regulations and information provided.',
            'Results are for informational purposes only and do not constitute professional tax advice.',
            'TaxEasy_ZA is not responsible for any errors or omissions in the calculations.',
            'For complex tax situations, please consult a registered tax practitioner or SARS directly.',
            'Tax laws and rates may change - always verify current rates before filing.'
        ];
        
        disclaimerText.forEach(text => {
            const lines = doc.splitTextToSize(text, 165);
            lines.forEach(line => {
                doc.text(line, 22, yPos);
                yPos += 3.5;
            });
        });
        
        return yPos;
    }
    
    addBasicFooter(doc) {
        const pageHeight = doc.internal.pageSize.getHeight();
        
        doc.setFillColor(108, 117, 125);
        doc.rect(0, pageHeight - 15, 210, 15, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Generated by TaxEasy_ZA - Professional South African Tax Services', 20, pageHeight - 8);
        doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 20, pageHeight - 4);
        
        doc.text('www.taxeasy-za.co.za', 160, pageHeight - 6);
    }
    
    addProfessionalFooter(doc) {
        const pageHeight = doc.internal.pageSize.getHeight();
        
        doc.setFillColor(3, 46, 97);
        doc.rect(0, pageHeight - 20, 210, 20, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('TaxEasy_ZA Professional Services', 20, pageHeight - 12);
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('Professional Tax Calculation & Advisory Services', 20, pageHeight - 8);
        doc.text('SARS Registered | SAICA Affiliated | Professional Indemnity Insured', 20, pageHeight - 4);
        
        doc.text('support@taxeasy-za.co.za', 150, pageHeight - 12);
        doc.text('www.taxeasy-za.co.za', 150, pageHeight - 8);
        doc.text(`Report ID: ${this.generateReportId()}`, 150, pageHeight - 4);
    }
    
    // Utility Methods
    calculateTaxSummary(taxData) {
        // Calculate tax summary from form data or tax results
        const grossIncome = this.calculateGrossIncome(taxData);
        const deductions = this.calculateTotalDeductions(taxData);
        const taxableIncome = Math.max(0, grossIncome - deductions);
        
        // Use the tax engine if available
        if (window.taxEngine) {
            const result = window.taxEngine.calculateTax(grossIncome, {
                age: taxData.personalInfo?.age || 'under65',
                retirementFunding: deductions,
                otherDeductions: 0
            });
            
            return {
                grossIncome: result.grossIncome,
                deductions: result.totalDeductions,
                taxableIncome: result.taxableIncome,
                taxPayable: result.finalTax,
                effectiveRate: result.effectiveRate,
                monthlyTax: result.monthlyTax || Math.round(result.finalTax / 12)
            };
        }
        
        // Fallback calculation
        const taxPayable = Math.max(0, taxableIncome * 0.25 - 17235);
        const effectiveRate = grossIncome > 0 ? (taxPayable / grossIncome * 100) : 0;
        
        return {
            grossIncome,
            deductions,
            taxableIncome,
            taxPayable,
            effectiveRate: Math.round(effectiveRate * 100) / 100,
            monthlyTax: Math.round(taxPayable / 12)
        };
    }
    
    calculateGrossIncome(taxData) {
        const incomeFields = [
            'basicSalary', 'bonus', 'commission', 'overtime',
            'travelAllowance', 'cellphoneAllowance', 'otherAllowances',
            'interestIncome', 'dividendIncome', 'rentalIncome'
        ];
        
        if (taxData.incomeData) {
            return incomeFields.reduce((total, field) => {
                return total + (taxData.incomeData[field] || 0);
            }, 0);
        }
        
        // Fallback to DOM elements
        return incomeFields.reduce((total, field) => {
            const element = document.getElementById(field);
            return total + (parseFloat(element?.value || 0));
        }, 0);
    }
    
    calculateTotalDeductions(taxData) {
        const deductionFields = [
            'pensionFund', 'providentFund', 'retirementAnnuity', 'medicalAid',
            'donations', 'homeOffice', 'solarPV', 'solarWaterHeater'
        ];
        
        if (taxData.deductionsData) {
            return deductionFields.reduce((total, field) => {
                return total + (taxData.deductionsData[field] || 0);
            }, 0);
        }
        
        // Fallback to DOM elements
        return deductionFields.reduce((total, field) => {
            const element = document.getElementById(field);
            return total + (parseFloat(element?.value || 0));
        }, 0);
    }
    
    getIncomeBreakdown(taxData) {
        const grossIncome = this.calculateGrossIncome(taxData);
        const incomeData = taxData.incomeData || {};
        
        const breakdown = [
            ['Basic Salary', incomeData.basicSalary || 0, ((incomeData.basicSalary || 0) / grossIncome) * 100],
            ['Bonuses', incomeData.bonus || 0, ((incomeData.bonus || 0) / grossIncome) * 100],
            ['Commission', incomeData.commission || 0, ((incomeData.commission || 0) / grossIncome) * 100],
            ['Allowances', (incomeData.travelAllowance || 0) + (incomeData.otherAllowances || 0), 0],
            ['Investment Income', (incomeData.interestIncome || 0) + (incomeData.dividendIncome || 0), 0],
            ['Other Income', incomeData.rentalIncome || 0, ((incomeData.rentalIncome || 0) / grossIncome) * 100]
        ];
        
        // Recalculate percentages for allowances and investment income
        breakdown[3][2] = (breakdown[3][1] / grossIncome) * 100;
        breakdown[4][2] = (breakdown[4][1] / grossIncome) * 100;
        
        return breakdown;
    }
    
    getDeductionsBreakdown(taxData) {
        const deductionsData = taxData.deductionsData || {};
        
        return [
            ['Retirement Funding', (deductionsData.pensionFund || 0) + (deductionsData.retirementAnnuity || 0), 
             ((deductionsData.pensionFund || 0) + (deductionsData.retirementAnnuity || 0)) * 0.31, 'Claimed'],
            ['Medical Aid', deductionsData.medicalAid || 0, (deductionsData.medicalAid || 0) * 0.25, 'Claimed'],
            ['Donations', deductionsData.donations || 0, (deductionsData.donations || 0) * 0.31, 'Claimed'],
            ['Home Office', deductionsData.homeOffice || 0, (deductionsData.homeOffice || 0) * 0.31, 'Claimed'],
            ['Renewable Energy', (deductionsData.solarPV || 0) + (deductionsData.solarWaterHeater || 0), 
             ((deductionsData.solarPV || 0) + (deductionsData.solarWaterHeater || 0)) * 0.31, 'Claimed']
        ];
    }
    
    getTaxBracketBreakdown(taxData) {
        const taxableIncome = this.calculateTaxSummary(taxData).taxableIncome;
        
        const brackets = [
            { min: 0, max: 237100, rate: '18%' },
            { min: 237101, max: 370500, rate: '26%' },
            { min: 370501, max: 512800, rate: '31%' },
            { min: 512801, max: 673000, rate: '36%' },
            { min: 673001, max: 857900, rate: '39%' },
            { min: 857901, max: 1817000, rate: '41%' },
            { min: 1817001, max: Infinity, rate: '45%' }
        ];
        
        const breakdown = [];
        let remainingIncome = taxableIncome;
        
        for (const bracket of brackets) {
            if (remainingIncome <= 0) break;
            
            const rangeMax = bracket.max === Infinity ? '∞' : bracket.max.toLocaleString();
            const range = `R${bracket.min.toLocaleString()} - R${rangeMax}`;
            
            const taxableInBracket = Math.min(remainingIncome, bracket.max - bracket.min + 1);
            const rate = parseFloat(bracket.rate.replace('%', '')) / 100;
            const tax = taxableInBracket * rate;
            
            if (taxableInBracket > 0) {
                breakdown.push({
                    range,
                    rate: bracket.rate,
                    taxableAmount: taxableInBracket,
                    tax: Math.round(tax)
                });
            }
            
            remainingIncome -= taxableInBracket;
        }
        
        return breakdown;
    }
    
    generateOptimizationRecommendations(taxData) {
        const recommendations = [];
        const grossIncome = this.calculateGrossIncome(taxData);
        const deductions = taxData.deductionsData || {};
        
        // Retirement annuity recommendation
        const currentRA = deductions.retirementAnnuity || 0;
        const maxRA = Math.min(grossIncome * 0.275, 350000);
        
        if (currentRA < maxRA) {
            const additionalRA = maxRA - currentRA;
            const taxSaving = additionalRA * 0.31; // Approximate marginal rate
            
            recommendations.push({
                title: 'Increase Retirement Annuity Contributions',
                description: `You can contribute an additional R${additionalRA.toLocaleString()} to your retirement annuity.`,
                saving: taxSaving
            });
        }
        
        // Medical aid recommendation
        if (!deductions.medicalAid && grossIncome > 200000) {
            recommendations.push({
                title: 'Consider Medical Aid Coverage',
                description: 'Medical aid contributions provide tax credits and important health coverage.',
                saving: 4368 // Annual medical aid tax credit
            });
        }
        
        // Solar installation recommendation
        if (!deductions.solarPV && grossIncome > 500000) {
            recommendations.push({
                title: 'Renewable Energy Tax Incentives',
                description: 'Solar installations qualify for Section 12B deductions, providing both tax savings and energy security.',
                saving: 15000 // Estimated saving on R50k installation
            });
        }
        
        // Home office recommendation
        if (!deductions.homeOffice && grossIncome > 300000) {
            recommendations.push({
                title: 'Home Office Expense Deduction',
                description: 'If you work from home, you can claim a portion of your household expenses as a tax deduction.',
                saving: 3100 // Estimated saving on R10k home office expenses
            });
        }
        
        return recommendations;
    }
    
    formatAgeGroup(age) {
        const ageGroups = {
            'under65': 'Under 65 years',
            '65-74': '65-74 years',
            '75+': '75+ years'
        };
        
        return ageGroups[age] || 'Not specified';
    }
    
    generateReportId() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `TR${timestamp}${random}`;
    }
    
    showError(message) {
        if (window.wizard && typeof window.wizard.showMessage === 'function') {
            window.wizard.showMessage(message, 'error');
        } else {
            alert(message);
        }
    }
}

// Initialize PDF generator
document.addEventListener('DOMContentLoaded', () => {
    window.pdfGenerator = new TaxReportPDF();
});

export default TaxReportPDF;
