export type RiskInput = {
  yearBuilt?: number;
  estimatedRent: number;
  askingPrice: number;
  propertyTaxAnnual?: number;
  insuranceAnnual?: number;
  hoaMonthly?: number;
};

export function analyzeRisks(input: RiskInput) {
  const age = input.yearBuilt ? new Date().getFullYear() - input.yearBuilt : 25;
  const grossYield =
    input.askingPrice > 0 ? ((input.estimatedRent * 12) / input.askingPrice) * 100 : 0;
  const hoa = input.hoaMonthly ?? 0;

  return [
    {
      label: "Inspection Risk",
      level: age > 35 ? "High" as const : age > 18 ? "Medium" as const : "Low" as const,
      reason:
        age > 18
          ? "Older homes may require closer review of roof, HVAC, plumbing, and foundation."
          : "Property age suggests lower immediate inspection risk, but inspection is still recommended.",
    },
    {
      label: "Rental Risk",
      level: grossYield >= 4 ? "Low" as const : grossYield >= 3 ? "Medium" as const : "High" as const,
      reason:
        grossYield >= 4
          ? "Estimated rental yield is healthy relative to the purchase price."
          : "Rental yield may be thin and should be validated with local rent comps.",
    },
    {
      label: "HOA / Carrying Cost Risk",
      level: hoa > 500 ? "High" as const : hoa > 250 ? "Medium" as const : "Low" as const,
      reason:
        hoa > 250
          ? "HOA and monthly carrying costs may reduce cash flow."
          : "HOA burden appears manageable based on current assumptions.",
    },
  ];
}
