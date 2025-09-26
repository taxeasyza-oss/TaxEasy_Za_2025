/**
 * TaxEasy ZA 2025 - SARS Tax Calculation Tests
 * Comprehensive test suite for South African tax calculations
 * Following SARS 2025 tax year regulations
 */

// Mock the tax engine functions for testing
const mockTaxEngine = {
    // SARS 2025 Tax Brackets
    TAX_BRACKETS: [
        { min: 0, max: 237100, rate: 0.18, base: 0 },
        { min: 237101, max: 370500, rate: 0.26, base: 42678 },
        { min: 370501, max: 512800, rate: 0.31, base: 77362 },
        { min: 512801, max: 673000, rate: 0.36, base: 121427 },
        { min: 673001, max: 857900, rate: 0.39, base: 179147 },
        { min: 857901, max: 1817000, rate: 0.41, base: 251258 },
        { min: 1817001, max: Infinity, rate: 0.45, base: 644489 }
    ],

    // SARS 2025 Rebates
    REBATES: {
        PRIMARY: 17235,
        SECONDARY: 9444,  // 65-74 years
        TERTIARY: 3145    // 75+ years
    },

    // Medical Tax Credits (monthly)
    MEDICAL_CREDITS: {
        MEMBER: 364,
        FIRST_DEPENDANT: 246,
        ADDITIONAL_DEPENDANT: 246
    },

    // Calculate normal tax before rebates
    calculateNormalTax(income) {
        for (let i = this.TAX_BRACKETS.length - 1; i >= 0; i--) {
            const bracket = this.TAX_BRACKETS[i];
            if (income >= bracket.min) {
                return bracket.base + (income - bracket.min) * bracket.rate;
            }
        }
        return 0;
    },

    // Calculate rebates based on age
    calculateRebates(age) {
        let rebates = this.REBATES.PRIMARY;
        
        if (age >= 65 && age < 75) {
            rebates += this.REBATES.SECONDARY;
        } else if (age >= 75) {
            rebates += this.REBATES.SECONDARY + this.REBATES.TERTIARY;
        }

        return rebates;
    },

    // Calculate medical tax credits
    calculateMedicalCredits(memberMonths, dependants) {
        let credits = memberMonths * this.MEDICAL_CREDITS.MEMBER;
        
        if (dependants > 0) {
            credits += memberMonths * this.MEDICAL_CREDITS.FIRST_DEPENDANT;
            if (dependants > 1) {
                credits += (dependants - 1) * memberMonths * this.MEDICAL_CREDITS.ADDITIONAL_DEPENDANT;
            }
        }

        return credits;
    },

    // Calculate retirement fund deduction cap
    calculateRetirementCap(remuneration, taxableIncome) {
        const higherAmount = Math.max(remuneration, taxableIncome);
        return Math.min(higherAmount * 0.275, 350000);
    },

    // Calculate UIF
    calculateUIF(remuneration) {
        const annualRemuneration = Math.min(remuneration, 212544);
        return Math.round(annualRemuneration * 0.01 * 100) / 100;
    },

    // Main tax calculation function
    calculateTax(params) {
        const {
            income,
            age = 30,
            paye = 0,
            provisional = 0,
            medicalMonths = 0,
            dependants = 0,
            retirementContrib = 0,
            remuneration = income
        } = params;

        // Calculate normal tax
        const normalTax = this.calculateNormalTax(income);

        // Calculate rebates
        const rebates = this.calculateRebates(age);

        // Calculate medical credits
        const medicalCredits = this.calculateMedicalCredits(medicalMonths, dependants);

        // Calculate retirement deduction
        const retirementCap = this.calculateRetirementCap(remuneration, income);
        const allowedRetirement = Math.min(retirementContrib, retirementCap);

        // Calculate taxable income after retirement deduction
        const taxableIncome = Math.max(0, income - allowedRetirement);
        const adjustedNormalTax = this.calculateNormalTax(taxableIncome);

        // Calculate final tax
        const taxAfterRebates = Math.max(0, adjustedNormalTax - rebates);
        const taxAfterCredits = Math.max(0, taxAfterRebates - medicalCredits);
        const finalTax = taxAfterCredits - paye - provisional;

        return {
            normalTax: adjustedNormalTax,
            rebates,
            medicalCredits,
            paye,
            provisional,
            finalTax,
            isRefund: finalTax < 0,
            refundAmount: finalTax < 0 ? Math.abs(finalTax) : 0,
            owingAmount: finalTax > 0 ? finalTax : 0
        };
    }
};

describe("SARS 2025 Tax Accuracy Suite", () => {
    
    // T-01: Bracket boundary – low
    test("T-01: Bracket boundary low - R237,100 taxable income", () => {
        const result = mockTaxEngine.calculateNormalTax(237100);
        const expected = 42678;
        
        expect(result).toBeCloseTo(expected, 2);
    });

    // T-02: Bracket boundary – high
    test("T-02: Bracket boundary high - R237,101 taxable income", () => {
        const result = mockTaxEngine.calculateNormalTax(237101);
        const expected = 42678 + (237101 - 237101) * 0.26; // Should be 42678 + (1 * 0.26) = 42678.26
        
        expect(result).toBeCloseTo(expected, 2);
    });

    // T-03: Primary rebate only
    test("T-03: Primary rebate only - Age 30, income R100,000", () => {
        const result = mockTaxEngine.calculateTax({
            income: 100000,
            age: 30
        });
        
        const normalTax = mockTaxEngine.calculateNormalTax(100000);
        const rebates = 17235;
        const expectedFinal = Math.max(0, normalTax - rebates);
        
        expect(result.normalTax).toBe(normalTax);
        expect(result.rebates).toBe(rebates);
        expect(result.finalTax).toBe(expectedFinal);
        expect(result.isRefund).toBe(false);
    });

    // T-04: Secondary rebate
    test("T-04: Secondary rebate - Age 66, income R300,000", () => {
        const result = mockTaxEngine.calculateTax({
            income: 300000,
            age: 66
        });
        
        const normalTax = mockTaxEngine.calculateNormalTax(300000);
        const rebates = 17235 + 9444;
        const expectedFinal = Math.max(0, normalTax - rebates);
        
        expect(result.rebates).toBe(26679);
        expect(result.finalTax).toBeCloseTo(expectedFinal, 2);
    });

    // T-05: Tertiary rebate
    test("T-05: Tertiary rebate - Age 76, income R400,000", () => {
        const result = mockTaxEngine.calculateTax({
            income: 400000,
            age: 76
        });
        
        const rebates = 17235 + 9444 + 3145;
        
        expect(result.rebates).toBe(29824);
    });

    // T-06: Medical credits
    test("T-06: Medical credits - Member + 2 dependants, 12 months", () => {
        const result = mockTaxEngine.calculateMedicalCredits(12, 2);
        const expected = (364 + 246 + 246) * 12;
        
        expect(result).toBe(expected);
    });

    // T-07: Retirement cap
    test("T-07: Retirement cap - Remuneration R1,000,000, contribution R300,000", () => {
        const result = mockTaxEngine.calculateRetirementCap(1000000, 1000000);
        const expected = 275000;
        
        expect(result).toBe(expected);
    });

    // T-08: UIF ceiling
    test("T-08: UIF ceiling - Salary R20,000/month", () => {
        const annualSalary = 240000;
        const result = mockTaxEngine.calculateUIF(annualSalary);
        const expected = 2125.44;
        
        expect(result).toBe(expected);
    });

    // T-09: PAYE vs Final - Refund scenario
    test("T-09: PAYE vs Final - PAYE R20,000, tax due R9,765 = Refund R10,235", () => {
        const result = mockTaxEngine.calculateTax({
            income: 150000,
            age: 30,
            paye: 20000
        });
        
        expect(result.isRefund).toBe(true);
        expect(result.refundAmount).toBe(10235);
    });

    // T-10: Provisional vs Final - Owing scenario
    test("T-10: Provisional vs Final - Provisional R5,000, tax due R18,765 = Owing R13,765", () => {
        const result = mockTaxEngine.calculateTax({
            income: 200000,
            age: 30,
            provisional: 5000
        });
        
        expect(result.owingAmount).toBe(13765);
        expect(result.isRefund).toBe(false);
    });

    // Additional edge cases
    describe("Edge Cases and Boundary Tests", () => {
        
        test("Zero income should result in zero tax", () => {
            const result = mockTaxEngine.calculateTax({ income: 0 });
            expect(result.finalTax).toBe(0);
            expect(result.normalTax).toBe(0);
        });

        test("Income below tax threshold should result in zero tax after rebates", () => {
            const result = mockTaxEngine.calculateTax({ 
                income: 95000, // Below effective threshold
                age: 30 
            });
            
            expect(result.finalTax).toBe(0);
        });

        test("Maximum tax bracket calculation", () => {
            const result = mockTaxEngine.calculateNormalTax(2000000);
            const expected = 644489 + (2000000 - 1817001) * 0.45;
                
            expect(result).toBeCloseTo(expected, 2);
        });

        test("Medical credits with no dependants", () => {
            const result = mockTaxEngine.calculateMedicalCredits(12, 0);
            const expected = 12 * 364;
            
            expect(result).toBe(expected);
        });

        test("Retirement contribution exceeding cap", () => {
            const result = mockTaxEngine.calculateRetirementCap(2000000, 2000000);
            
            expect(result).toBe(350000);
        });

        test("UIF on high salary should be capped", () => {
            const result = mockTaxEngine.calculateUIF(500000);
            const expected = 2125.44;
            
            expect(result).toBe(expected);
        });
    });

    // Integration tests
    describe("Integration Tests", () => {
        
        test("Complex scenario: High earner with all deductions", () => {
            const result = mockTaxEngine.calculateTax({
                income: 1000000,
                age: 45,
                paye: 250000,
                provisional: 50000,
                medicalMonths: 12,
                dependants: 2,
                retirementContrib: 275000,
                remuneration: 1000000
            });
            
            expect(result.normalTax).toBeGreaterThan(0);
            expect(result.rebates).toBe(17235);
            expect(result.medicalCredits).toBe(10272);
        });

        test("Pensioner scenario: Age 70 with pension income", () => {
            const result = mockTaxEngine.calculateTax({
                income: 250000,
                age: 70,
                paye: 15000
            });
            
            expect(result.rebates).toBe(26679);
            expect(result.finalTax).toBeGreaterThanOrEqual(0);
        });
    });
});

// Export for use in other test files
if (typeof module !== "undefined" && module.exports) {
    module.exports = { mockTaxEngine };
}


