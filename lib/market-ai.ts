export function generateMarketSummary(
  investmentScore: number,
  rentalYield: number
) {
  let strength = "";
  let outlook = "";
  let risk = "";

  if (investmentScore >= 82) {
    strength = "strong long-term investment characteristics";
  } else if (investmentScore >= 75) {
    strength = "balanced investment characteristics";
  } else {
    strength = "mixed investment characteristics";
  }

  if (rentalYield >= 5) {
    outlook = "attractive rental income potential";
  } else if (rentalYield >= 3.5) {
    outlook = "moderate rental income potential";
  } else {
    outlook = "limited rental income potential";
  }

  if (investmentScore >= 80) {
    risk = "relatively lower market risk";
  } else {
    risk = "moderate market uncertainty";
  }

  return `Nestrova AI estimates this market currently demonstrates ${strength}, with ${outlook} and ${risk}. Individual property performance can vary, so each property should still be analyzed separately before making an investment decision.`;
}