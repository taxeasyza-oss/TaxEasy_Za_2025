// TaxEasy_ZA 2025 - Client-side PDF Report Generator
// Uses pdfmake to generate professional tax reports directly in the browser
// POPIA Compliant - All processing happens client-side

class TaxEasyPDFGenerator {
    constructor() {
        this.initialized = false;
        this.pdfMake = null;
        this.vfs = null;
        this.fonts = null;
    }

    async initialize() {
        if (this.initialized) return;

        try {
            // Check if pdfmake is loaded
            if (typeof pdfMake === 'undefined') {
                throw new Error('pdfMake library not loaded');
            }

            this.pdfMake = pdfMake;
            this.initialized = true;
            console.log('TaxEasy PDF Generator initialized successfully');
        } catch (error) {
            console.error('Failed to initialize PDF generator:', error);
            throw error;
        }
    }

    formatCurrency(amount) {
        if (typeof amount !== 'number' || isNaN(amount)) return 'R0.00';
        return new Intl.NumberFormat('en-ZA', {
            style: 'currency',
            currency: 'ZAR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount).replace('ZAR', 'R');
    }

    formatPercentage(rate) {
        if (typeof rate !== 'number' || isNaN(rate)) return '0.00%';
        return rate.toFixed(2) + '%';
    }

    formatDate(date = new Date()) {
        return date.toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    createDocumentDefinition(taxData, userInfo = {}, reportType = 'basic') {
        const currentDate = new Date();
        const taxYear = taxData.taxYear || '2025';

        return {
            pageSize: 'A4',
            pageMargins: [40, 60, 40, 60],
            
            header: {
                columns: [
                    {
                        text: 'TaxEasy ZA 2025',
                        style: 'header',
                        alignment: 'left',
                        margin: [40, 20, 0, 0]
                    },
                    {
                        text: `Generated: ${this.formatDate(currentDate)}`,
                        style: 'subheader',
                        alignment: 'right',
                        margin: [0, 25, 40, 0]
                    }
                ]
            },

            footer: function(currentPage, pageCount) {
                return {
                    columns: [
                        {
                            text: 'POPIA Compliant - All data processed client-side',
                            style: 'footer',
                            alignment: 'left',
                            margin: [40, 0, 0, 0]
                        },
                        {
                            text: `Page ${currentPage} of ${pageCount}`,
                            style: 'footer',
                            alignment: 'right',
                            margin: [0, 0, 40, 0]
                        }
                    ]
                };
            },

            content: [
                // Title Section
                {
                    text: 'SARS Compliant Tax Calculation Report',
                    style: 'title',
                    alignment: 'center',
                    margin: [0, 0, 0, 20]
                },
                {
                    text: `Tax Year: ${taxYear}`,
                    style: 'subtitle',
                    alignment: 'center',
                    margin: [0, 0, 0, 30]
                },

                // Personal Information Section
                {
                    text: 'Personal Information',
                    style: 'sectionHeader',
                    margin: [0, 0, 0, 10]
                },
                {
                    table: {
                        widths: ['30%', '70%'],
                        body: [
                            ['Full Name:', userInfo.fullName || 'Not provided'],
                            ['ID/Passport Number:', userInfo.idNumber || 'Not provided'],
                            ['Age Group:', this.getAgeGroupDescription(userInfo.ageGroup)],
                            ['Occupation:', userInfo.occupation || 'Not specified'],
                            ['Tax Reference Number:', userInfo.taxNumber || 'Not provided']
                        ]
                    },
                    style: 'infoTable',
                    margin: [0, 0, 0, 20]
                },

                // Tax Calculation Summary
                {
                    text: 'Tax Calculation Summary',
                    style: 'sectionHeader',
                    margin: [0, 0, 0, 10]
                },
                {
                    table: {
                        widths: ['50%', '50%'],
                        body: [
                            [
                                { text: 'Gross Annual Income:', style: 'tableLabel' },
                                { text: this.formatCurrency(taxData.grossIncome), style: 'tableValue' }
                            ],
                            [
                                { text: 'Total Deductions:', style: 'tableLabel' },
                                { text: this.formatCurrency(taxData.deductions?.total || 0), style: 'tableValue' }
                            ],
                            [
                                { text: 'Taxable Income:', style: 'tableLabel' },
                                { text: this.formatCurrency(taxData.taxableIncome), style: 'tableValue' }
                            ],
                            [
                                { text: 'Tax Before Rebates:', style: 'tableLabel' },
                                { text: this.formatCurrency(taxData.taxBeforeRebates || 0), style: 'tableValue' }
                            ],
                            [
                                { text: 'Total Rebates & Credits:', style: 'tableLabel' },
                                { text: this.formatCurrency(taxData.rebatesAndCredits?.total || 0), style: 'tableValue' }
                            ],
                            [
                                { text: 'Annual Tax Payable:', style: 'tableLabel', bold: true },
                                { text: this.formatCurrency(taxData.taxPayable), style: 'tableValueBold' }
                            ],
                            [
                                { text: 'Monthly Tax:', style: 'tableLabel' },
                                { text: this.formatCurrency(taxData.monthlyTax), style: 'tableValue' }
                            ],
                            [
                                { text: 'Net Annual Income:', style: 'tableLabel', bold: true },
                                { text: this.formatCurrency(taxData.netIncome), style: 'tableValueBold' }
                            ]
                        ]
                    },
                    style: 'summaryTable',
                    margin: [0, 0, 0, 20]
                },

                // Tax Rates Section
                {
                    text: 'Tax Rate Information',
                    style: 'sectionHeader',
                    margin: [0, 0, 0, 10]
                },
                {
                    table: {
                        widths: ['50%', '50%'],
                        body: [
                            [
                                { text: 'Effective Tax Rate:', style: 'tableLabel' },
                                { text: this.formatPercentage(taxData.effectiveRate || 0), style: 'tableValue' }
                            ],
                            [
                                { text: 'Marginal Tax Rate:', style: 'tableLabel' },
                                { text: this.formatPercentage(taxData.marginalRate || 0), style: 'tableValue' }
                            ]
                        ]
                    },
                    style: 'infoTable',
                    margin: [0, 0, 0, 20]
                },

                // Add detailed breakdown for professional/premium reports
                ...(reportType !== 'basic' ? this.getDetailedContent(taxData, reportType) : []),

                // Disclaimer Section
                {
                    text: 'Important Disclaimers',
                    style: 'sectionHeader',
                    margin: [0, 20, 0, 10]
                },
                {
                    ul: [
                        'This report is generated for informational purposes only and does not constitute professional tax advice.',
                        'All calculations are based on the 2025 South African Revenue Service (SARS) tax tables and regulations.',
                        'Individual circumstances may affect your actual tax liability. Consult a qualified tax professional for personalized advice.',
                        'This application processes all data client-side in compliance with POPIA (Protection of Personal Information Act).',
                        'No personal information is transmitted to or stored on external servers.',
                        'Ensure all information entered is accurate as this affects the calculation results.'
                    ],
                    style: 'disclaimer',
                    margin: [0, 0, 0, 20]
                },

                // Legislative References
                {
                    text: 'Legislative References',
                    style: 'sectionHeader',
                    margin: [0, 10, 0, 10]
                },
                {
                    text: [
                        'This calculation is based on the Income Tax Act, 1962 (Act No. 58 of 1962) and the ',
                        'Tax Administration Act, 2011 (Act No. 28 of 2011). Tax rates and thresholds are ',
                        'as published by SARS for the 2025 tax year.'
                    ],
                    style: 'legislative',
                    margin: [0, 0, 0, 10]
                }
            ],

            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    color: '#2c5aa0'
                },
                subheader: {
                    fontSize: 10,
                    color: '#666666'
                },
                title: {
                    fontSize: 20,
                    bold: true,
                    color: '#2c5aa0'
                },
                subtitle: {
                    fontSize: 14,
                    color: '#666666'
                },
                sectionHeader: {
                    fontSize: 14,
                    bold: true,
                    color: '#2c5aa0'
                },
                tableLabel: {
                    fontSize: 10,
                    color: '#333333'
                },
                tableValue: {
                    fontSize: 10,
                    alignment: 'right',
                    color: '#333333'
                },
                tableValueBold: {
                    fontSize: 10,
                    alignment: 'right',
                    bold: true,
                    color: '#2c5aa0'
                },
                disclaimer: {
                    fontSize: 9,
                    color: '#666666',
                    italics: true
                },
                legislative: {
                    fontSize: 9,
                    color: '#666666'
                },
                footer: {
                    fontSize: 8,
                    color: '#999999'
                },
                infoTable: {
                    fontSize: 10
                },
                summaryTable: {
                    fontSize: 10
                }
            },

            defaultStyle: {
                fontSize: 10,
                lineHeight: 1.3
            }
        };
    }

    getDetailedContent(taxData, reportType) {
        const content = [];

        // Tax Bracket Breakdown
        if (taxData.bracketBreakdown && taxData.bracketBreakdown.length > 0) {
            content.push(
                {
                    text: 'Tax Bracket Breakdown',
                    style: 'sectionHeader',
                    margin: [0, 20, 0, 10],
                    pageBreak: 'before'
                },
                {
                    table: {
                        widths: ['30%', '15%', '25%', '30%'],
                        headerRows: 1,
                        body: [
                            [
                                { text: 'Income Range', style: 'tableLabel', bold: true },
                                { text: 'Rate', style: 'tableLabel', bold: true },
                                { text: 'Taxable Amount', style: 'tableLabel', bold: true },
                                { text: 'Tax', style: 'tableLabel', bold: true }
                            ],
                            ...taxData.bracketBreakdown.map(bracket => [
                                bracket.range,
                                bracket.rate,
                                this.formatCurrency(bracket.taxableAmount),
                                this.formatCurrency(bracket.tax)
                            ])
                        ]
                    },
                    style: 'infoTable',
                    margin: [0, 0, 0, 20]
                }
            );
        }

        // Deductions Breakdown
        if (taxData.deductions) {
            content.push(
                {
                    text: 'Deductions Breakdown',
                    style: 'sectionHeader',
                    margin: [0, 20, 0, 10]
                },
                {
                    table: {
                        widths: ['70%', '30%'],
                        body: [
                            [
                                { text: 'Retirement Fund Contributions:', style: 'tableLabel' },
                                { text: this.formatCurrency(taxData.deductions.retirement || 0), style: 'tableValue' }
                            ],
                            [
                                { text: 'Medical Aid Contributions:', style: 'tableLabel' },
                                { text: this.formatCurrency(taxData.deductions.medical || 0), style: 'tableValue' }
                            ],
                            [
                                { text: 'Other Deductions:', style: 'tableLabel' },
                                { text: this.formatCurrency(taxData.deductions.other || 0), style: 'tableValue' }
                            ]
                        ]
                    },
                    style: 'infoTable',
                    margin: [0, 0, 0, 20]
                }
            );
        }

        // Rebates and Credits
        if (taxData.rebatesAndCredits) {
            content.push(
                {
                    text: 'Rebates and Tax Credits',
                    style: 'sectionHeader',
                    margin: [0, 20, 0, 10]
                },
                {
                    table: {
                        widths: ['70%', '30%'],
                        body: [
                            [
                                { text: 'Primary Rebate:', style: 'tableLabel' },
                                { text: this.formatCurrency(taxData.rebatesAndCredits.rebates || 0), style: 'tableValue' }
                            ],
                            [
                                { text: 'Medical Aid Tax Credits:', style: 'tableLabel' },
                                { text: this.formatCurrency(taxData.rebatesAndCredits.medicalCredits || 0), style: 'tableValue' }
                            ]
                        ]
                    },
                    style: 'infoTable',
                    margin: [0, 0, 0, 20]
                }
            );
        }

        return content;
    }

    getAgeGroupDescription(ageGroup) {
        const descriptions = {
            'under65': 'Under 65 years',
            '65-74': '65 to 74 years',
            '75+': '75 years and older'
        };
        return descriptions[ageGroup] || 'Not specified';
    }

    async generatePDF(taxData, userInfo = {}, reportType = 'basic') {
        try {
            await this.initialize();

            const docDefinition = this.createDocumentDefinition(taxData, userInfo, reportType);
            const fileName = `TaxEasy_ZA_${reportType}_Report_${new Date().toISOString().slice(0, 10)}.pdf`;

            // Generate and download the PDF
            this.pdfMake.createPdf(docDefinition).download(fileName);

            console.log(`PDF report generated successfully: ${fileName}`);
            return { success: true, fileName };

        } catch (error) {
            console.error('Error generating PDF:', error);
            throw new Error(`Failed to generate PDF report: ${error.message}`);
        }
    }

    async previewPDF(taxData, userInfo = {}, reportType = 'basic') {
        try {
            await this.initialize();

            const docDefinition = this.createDocumentDefinition(taxData, userInfo, reportType);
            
            // Open PDF in new window for preview
            this.pdfMake.createPdf(docDefinition).open();

            console.log('PDF preview opened successfully');
            return { success: true };

        } catch (error) {
            console.error('Error previewing PDF:', error);
            throw new Error(`Failed to preview PDF report: ${error.message}`);
        }
    }
}

// Create global instance
window.TaxEasyPDFGenerator = TaxEasyPDFGenerator;

// Backward compatibility function
window.generateClientSidePdfReport = async function(taxData, reportType = 'basic', userInfo = {}) {
    try {
        const generator = new TaxEasyPDFGenerator();
        return await generator.generatePDF(taxData, userInfo, reportType);
    } catch (error) {
        console.error('Error in generateClientSidePdfReport:', error);
        throw error;
    }
};

// Preview function
window.previewClientSidePdfReport = async function(taxData, reportType = 'basic', userInfo = {}) {
    try {
        const generator = new TaxEasyPDFGenerator();
        return await generator.previewPDF(taxData, userInfo, reportType);
    } catch (error) {
        console.error('Error in previewClientSidePdfReport:', error);
        throw error;
    }
};

console.log('TaxEasy Client-side PDF Generator loaded successfully');

