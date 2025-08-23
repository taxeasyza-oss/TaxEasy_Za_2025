// South African 2024/2025 tax rates and thresholds
const TAX_THRESHOLDS_2025 = {
  'under65': 95750,    // SARS 2024/2025 official threshold
  '65to75': 148217,    // SARS 2024/2025 official threshold
  'over75': 165689     // SARS 2024/2025 official threshold
};

const TAX_RATES_2025 = [
  { threshold: 237100, rate: 0.18 },
  { threshold: 370500, rate: 0.26 },
  { threshold: 512800, rate: 0.31 },
  { threshold: 673000, rate: 0.36 },
  { threshold: 857900, rate: 0.39 },
  { threshold: 1817000, rate: 0.41 },
  { threshold: Infinity, rate: 0.45 }
];

const REBATES_2025 = {
  primary: 17235,
  secondary: 9450,
  tertiary: 3141
};

// Medical tax credits
const MEDICAL_CREDITS_2025 = {
  mainMember: 364,
  dependent: 364
};

// Calculate South African income tax
function calculateTax(taxData) {
  const {
    ageGroup = 'under65',
    annualIncome = 0,
    retirementFunding = 0,
    medicalAidContributions = 0,
    medicalAidDependents = 0,
    travelAllowance = 0,
    otherDeductions = 0,
    renewableEnergyExpenses = 0
  } = taxData;

  // Calculate taxable income
  let taxableIncome = annualIncome;
  
  // Retirement annuity deduction (max 27.5% of annual income or R350,000)
  const raDeduction = Math.min(retirementFunding, annualIncome * 0.275, 350000);
  taxableIncome -= raDeduction;
  
  // Travel allowance (80% is taxable)
  const taxableTravelAllowance = travelAllowance * 0.8;
  taxableIncome += taxableTravelAllowance;
  
  // Other deductions
  taxableIncome -= otherDeductions;
  
  // Renewable energy deduction (section 12B)
  const energyDeduction = Math.min(renewableEnergyExpenses, 1000000);
  taxableIncome -= energyDeduction;

  // Calculate tax based on brackets
  let taxPayable = 0;
  let remainingIncome = taxableIncome;
  let previousThreshold = 0;

  for (const bracket of TAX_RATES_2025) {
    if (remainingIncome <= 0) break;
    
    const taxableInBracket = Math.min(
      remainingIncome,
      bracket.threshold - previousThreshold
    );
    
    taxPayable += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
    previousThreshold = bracket.threshold;
  }

  // Apply rebates based on age
  let totalRebates = REBATES_2025.primary;
  if (ageGroup === '65to75') {
    totalRebates += REBATES_2025.secondary;
  } else if (ageGroup === 'over75') {
    totalRebates += REBATES_2025.secondary + REBATES_2025.tertiary;
  }

  // Apply medical tax credits
  const medicalCredits = MEDICAL_CREDITS_2025.mainMember + 
                        (MEDICAL_CREDITS_2025.dependent * medicalAidDependents);
  
  // Additional medical expenses deduction (7.5% of income threshold)
  const additionalMedicalDeduction = Math.max(0, additionalMedicalExpenses - (0.075 * annualIncome));
  taxPayable -= additionalMedicalDeduction;
  
  // Disability additional deduction
  if (disability) {
    taxPayable -= DISABILITY_DEDUCTION_2025;
  }

  taxPayable = Math.max(0, taxPayable - totalRebates - medicalCredits);

  // Calculate effective tax rate
  const effectiveTaxRate = annualIncome > 0 ? (taxPayable / annualIncome) * 100 : 0;

  return {
    taxableIncome: Math.max(0, taxableIncome),
    taxPayable: Math.round(taxPayable),
    effectiveTaxRate: effectiveTaxRate.toFixed(2),
    monthlyTax: Math.round(taxPayable / 12),
    deductions: {
      retirementAnnuity: raDeduction,
      medical: medicalCredits,
      renewableEnergy: energyDeduction,
      other: otherDeductions
    },
    rebates: totalRebates
  };
}

module.exports = { calculateTax, TAX_THRESHOLDS_2025, TAX_RATES_2025 };