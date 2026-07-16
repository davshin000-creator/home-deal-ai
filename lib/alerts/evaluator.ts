export type PublicOpportunity = {
  symbol?: string;
  opportunity_score?: number;
  regime?: string;
  risk?: string;
  research_style?: string;
};

export type WatchlistAlertInput = {
  id: string;
  user_id: string;
  symbol: string;
  asset_type: string;
  alert_enabled: boolean;
  opportunity_threshold: number;
  risk_threshold: string | null;
};

export type AlertCandidate = {
  userId: string;
  watchlistId: string;
  symbol: string;
  alertType: "OPPORTUNITY" | "RISK";
  alertKey: string;
  title: string;
  message: string;
  opportunityScore: number | null;
  marketRegime: string | null;
  riskLevel: string | null;
  triggeredValue: number | null;
  thresholdValue: number | null;
  metadata: Record<string, unknown>;
};

export function normalizeSymbol(value?: string | null) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/^KRW-/, "")
    .replace(/^USDT-/, "")
    .replace(/^USD-/, "");
}

function currentUtcHourBucket() {
  return new Date().toISOString().slice(0, 13);
}

export function evaluateWatchlistItem(
  item: WatchlistAlertInput,
  opportunity: PublicOpportunity | undefined,
): AlertCandidate[] {
  if (!item.alert_enabled || !opportunity) {
    return [];
  }

  const candidates: AlertCandidate[] = [];
  const symbol = normalizeSymbol(item.symbol);
  const bucket = currentUtcHourBucket();

  const score = opportunity.opportunity_score;

  if (
    typeof score === "number" &&
    score >= item.opportunity_threshold
  ) {
    candidates.push({
      userId: item.user_id,
      watchlistId: item.id,
      symbol,
      alertType: "OPPORTUNITY",
      alertKey: [
        item.user_id,
        item.id,
        "OPPORTUNITY",
        item.opportunity_threshold,
        bucket,
      ].join(":"),
      title: `${symbol} Opportunity Alert`,
      message: `${symbol} reached an Opportunity Score of ${score}, meeting your threshold of ${item.opportunity_threshold}.`,
      opportunityScore: score,
      marketRegime: opportunity.regime ?? null,
      riskLevel: opportunity.risk ?? null,
      triggeredValue: score,
      thresholdValue: item.opportunity_threshold,
      metadata: {
        research_style: opportunity.research_style ?? null,
      },
    });
  }

  if (
    item.risk_threshold &&
    opportunity.risk?.toUpperCase() ===
      item.risk_threshold.toUpperCase()
  ) {
    candidates.push({
      userId: item.user_id,
      watchlistId: item.id,
      symbol,
      alertType: "RISK",
      alertKey: [
        item.user_id,
        item.id,
        "RISK",
        item.risk_threshold.toUpperCase(),
        bucket,
      ].join(":"),
      title: `${symbol} Risk Alert`,
      message: `${symbol} currently matches your ${item.risk_threshold.toUpperCase()} risk alert condition.`,
      opportunityScore: score ?? null,
      marketRegime: opportunity.regime ?? null,
      riskLevel: opportunity.risk ?? null,
      triggeredValue: null,
      thresholdValue: null,
      metadata: {
        research_style: opportunity.research_style ?? null,
      },
    });
  }

  return candidates;
}
