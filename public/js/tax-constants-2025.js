// SARS 2025 tax year (1 Mar 2024 – 28 Feb 2025)
export const BRACKETS_2025 = [
  { floor: 0, ceiling: 237100, rate: 0.18 },
  { floor: 237101, ceiling: 370500, rate: 0.26 },
  { floor: 370501, ceiling: 512800, rate: 0.31 },
  { floor: 512801, ceiling: 673000, rate: 0.36 },
  { floor: 673001, ceiling: 857900, rate: 0.39 },
  { floor: 857901, ceiling: 1817000, rate: 0.41 },
  { floor: 1817001, ceiling: Infinity, rate: 0.45 }
];

export const REBATES_2025 = {
  primary: 17235,
  secondary: 9444,   // 65+
  tertiary: 3148     // 75+
};

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
