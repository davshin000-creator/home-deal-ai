export type ScenarioInput = {
  purchasePrice: number;
  downPaymentPercent: number;
  interestRate: number;
  loanYears: number;
  monthlyRent: number;
  propertyTaxAnnual: number;
  insuranceAnnual: number;
  hoaMonthly: number;
  vacancyPercent: number;
  maintenancePercent: number;
  managementPercent: number;
  closingCostPercent: number;
};

export function calculateMortgagePayment(
  loanAmount: number,
  annualRate: number,
  years: number
) {
  const monthlyRate = annualRate / 100 / 12;
  const payments = years * 12;
  if (monthlyRate === 0) return loanAmount / payments;

  return (
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, payments)) /
    (Math.pow(1 + monthlyRate, payments) - 1)
  );
}

export function calculateScenario(input: ScenarioInput) {
  const downPayment = input.purchasePrice * (input.downPaymentPercent / 100);
  const loanAmount = Math.max(0, input.purchasePrice - downPayment);
  const monthlyMortgage = calculateMortgagePayment(
    loanAmount,
    input.interestRate,
    input.loanYears
  );

  const monthlyTax = input.propertyTaxAnnual / 12;
  const monthlyInsurance = input.insuranceAnnual / 12;
  const monthlyVacancy = input.monthlyRent * (input.vacancyPercent / 100);
  const monthlyMaintenance = input.monthlyRent * (input.maintenancePercent / 100);
  const monthlyManagement = input.monthlyRent * (input.managementPercent / 100);

  const monthlyExpenses =
    monthlyMortgage +
    monthlyTax +
    monthlyInsurance +
    input.hoaMonthly +
    monthlyVacancy +
    monthlyMaintenance +
    monthlyManagement;

  const monthlyCashFlow = input.monthlyRent - monthlyExpenses;
  const annualCashFlow = monthlyCashFlow * 12;

  const noi =
    input.monthlyRent * 12 -
    (monthlyTax +
      monthlyInsurance +
      input.hoaMonthly +
      monthlyVacancy +
      monthlyMaintenance +
      monthlyManagement) *
      12;

  const capRate = input.purchasePrice ? (noi / input.purchasePrice) * 100 : 0;
  const closingCosts = input.purchasePrice * (input.closingCostPercent / 100);
  const cashNeeded = downPayment + closingCosts;
  const cashOnCashReturn = cashNeeded ? (annualCashFlow / cashNeeded) * 100 : 0;
  const grossYield = input.purchasePrice
    ? ((input.monthlyRent * 12) / input.purchasePrice) * 100
    : 0;

  return {
    downPayment,
    loanAmount,
    monthlyMortgage,
    monthlyTax,
    monthlyInsurance,
    monthlyVacancy,
    monthlyMaintenance,
    monthlyManagement,
    monthlyExpenses,
    monthlyCashFlow,
    annualCashFlow,
    noi,
    capRate,
    cashNeeded,
    cashOnCashReturn,
    grossYield,
  };
}

export function formatMoney(value: number) {
  return `$${Math.round(value || 0).toLocaleString()}`;
}

export function formatPercent(value: number) {
  return `${Number(value || 0).toFixed(2)}%`;
}
