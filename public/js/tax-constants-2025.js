// SARS 2025 Tax Rates (1 March 2024 - 28 February 2025)
export const TAX_BRACKETS = [
    { threshold: 226000, rate: 0.18 },
    { threshold: 353100, rate: 0.26 },
    { threshold: 488700, rate: 0.31 },
    { threshold: 641400, rate: 0.36 },
    { threshold: 817600, rate: 0.39 },
    { threshold: 1731600, rate: 0.41 },
    { threshold: Infinity, rate: 0.45 }
];

export const MEDICAL_CREDITS = {
    mainMember: 364,
    firstDependant: 364,
    additionalDependants: 246
};

export const REBATES = {
    primary: 17235,
    over65: 9444,
    over75: 3145
};

export const RETIREMENT_LIMITS = {
    percentage: 0.275,
    annualCap: 350000
};

export const TRAVEL_RATES = {
    fixedPerKm: 4.20,
    deemedCostPercentage: 0.20
};


