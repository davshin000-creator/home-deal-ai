export type PublicOpportunity = {
  symbol?: string;
  opportunity_score?: number;
  confidence?: number;
  regime?: string;
  risk?: string;
  direction?: string;
  outlook?: string;
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
  last_confidence?: number | null;
  last_direction?: string | null;
  last_outlook?: string | null;
  last_risk?: string | null;
  last_research_checked_at?: string | null;
};

export type AlertCandidate = {
  userId: string;
  watchlistId: string;
  symbol: string;
  alertType:
    | "OPPORTUNITY"
    | "RISK"
    | "CONFIDENCE_CHANGE"
    | "DIRECTION_CHANGE"
    | "OUTLOOK_CHANGE"
    | "RISK_CHANGE";
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

  const confidence =
    typeof opportunity.confidence === "number" &&
    Number.isFinite(opportunity.confidence)
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round(opportunity.confidence),
          ),
        )
      : null;

  const direction =
    opportunity.direction
      ?.trim()
      .toUpperCase() || null;

  const outlook =
    opportunity.outlook
      ?.trim()
      .toUpperCase() || null;

  const risk =
    opportunity.risk
      ?.trim()
      .toUpperCase() || null;

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

  /*
   * Confidence change:
   * use a 5-point minimum move to avoid noisy
   * notifications from very small fluctuations.
   */
  if (
    confidence !== null &&
    item.last_confidence !== null &&
    item.last_confidence !== undefined
  ) {
    const previousConfidence =
      Number(item.last_confidence);

    const delta =
      confidence - previousConfidence;

    if (
      Number.isFinite(previousConfidence) &&
      Math.abs(delta) >= 5
    ) {
      candidates.push({
        userId: item.user_id,
        watchlistId: item.id,
        symbol,
        alertType:
          "CONFIDENCE_CHANGE",
        alertKey: [
          item.user_id,
          item.id,
          "CONFIDENCE_CHANGE",
          previousConfidence,
          confidence,
          bucket,
        ].join(":"),
        title:
          `${symbol} AI Confidence Changed`,
        message:
          `${symbol} AI confidence moved from ${previousConfidence}% to ${confidence}% (${delta > 0 ? "+" : ""}${delta}).`,
        opportunityScore:
          score ?? null,
        marketRegime:
          opportunity.regime ?? null,
        riskLevel:
          risk,
        triggeredValue:
          confidence,
        thresholdValue:
          5,
        metadata: {
          previous_confidence:
            previousConfidence,
          current_confidence:
            confidence,
          delta,
          direction,
          outlook,
          research_style:
            opportunity.research_style ??
            null,
        },
      });
    }
  }

  /*
   * Direction change.
   */
  if (
    direction &&
    item.last_direction &&
    direction !==
      item.last_direction
        .trim()
        .toUpperCase()
  ) {
    const previousDirection =
      item.last_direction
        .trim()
        .toUpperCase();

    candidates.push({
      userId: item.user_id,
      watchlistId: item.id,
      symbol,
      alertType:
        "DIRECTION_CHANGE",
      alertKey: [
        item.user_id,
        item.id,
        "DIRECTION_CHANGE",
        previousDirection,
        direction,
        bucket,
      ].join(":"),
      title:
        `${symbol} Direction Changed`,
      message:
        `${symbol} research direction changed from ${previousDirection} to ${direction}.`,
      opportunityScore:
        score ?? null,
      marketRegime:
        opportunity.regime ?? null,
      riskLevel:
        risk,
      triggeredValue:
        null,
      thresholdValue:
        null,
      metadata: {
        previous_direction:
          previousDirection,
        current_direction:
          direction,
        confidence,
        outlook,
        research_style:
          opportunity.research_style ??
          null,
      },
    });
  }

  /*
   * Outlook change.
   */
  if (
    outlook &&
    item.last_outlook &&
    outlook !==
      item.last_outlook
        .trim()
        .toUpperCase()
  ) {
    const previousOutlook =
      item.last_outlook
        .trim()
        .toUpperCase();

    candidates.push({
      userId: item.user_id,
      watchlistId: item.id,
      symbol,
      alertType:
        "OUTLOOK_CHANGE",
      alertKey: [
        item.user_id,
        item.id,
        "OUTLOOK_CHANGE",
        previousOutlook,
        outlook,
        bucket,
      ].join(":"),
      title:
        `${symbol} AI Outlook Changed`,
      message:
        `${symbol} AI outlook changed from ${previousOutlook} to ${outlook}.`,
      opportunityScore:
        score ?? null,
      marketRegime:
        opportunity.regime ?? null,
      riskLevel:
        risk,
      triggeredValue:
        null,
      thresholdValue:
        null,
      metadata: {
        previous_outlook:
          previousOutlook,
        current_outlook:
          outlook,
        confidence,
        direction,
        research_style:
          opportunity.research_style ??
          null,
      },
    });
  }

  /*
   * Risk change is separate from the existing
   * user-selected risk-level threshold alert.
   */
  if (
    risk &&
    item.last_risk &&
    risk !==
      item.last_risk
        .trim()
        .toUpperCase()
  ) {
    const previousRisk =
      item.last_risk
        .trim()
        .toUpperCase();

    candidates.push({
      userId: item.user_id,
      watchlistId: item.id,
      symbol,
      alertType:
        "RISK_CHANGE",
      alertKey: [
        item.user_id,
        item.id,
        "RISK_CHANGE",
        previousRisk,
        risk,
        bucket,
      ].join(":"),
      title:
        `${symbol} Risk Changed`,
      message:
        `${symbol} research risk changed from ${previousRisk} to ${risk}.`,
      opportunityScore:
        score ?? null,
      marketRegime:
        opportunity.regime ?? null,
      riskLevel:
        risk,
      triggeredValue:
        null,
      thresholdValue:
        null,
      metadata: {
        previous_risk:
          previousRisk,
        current_risk:
          risk,
        confidence,
        direction,
        outlook,
        research_style:
          opportunity.research_style ??
          null,
      },
    });
  }

  return candidates;
}
