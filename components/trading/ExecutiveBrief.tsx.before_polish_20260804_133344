type MarketState = {
  base_asset?: string;
  regime?: string;
  confidence?: number;
  risk?: string;
  research_style?: string;
};

type Opportunity = {
  symbol?: string;
  opportunity_score?: number;
  regime?: string;
  risk?: string;
  research_style?: string;
  score_basis?: string;
};

type CouncilState = {
  consensus?: string;
  confidence?: number;
  veto?: boolean;
  agent_count?: number;
};

type SystemState = {
  recommended_action?: string;
};

type ExecutiveBriefProps = {
  market?: MarketState;
  opportunities?: Opportunity[];
  council?: CouncilState;
  system?: SystemState;
};

type MarketSummary = {
  label: string;
  symbol: string;
  classes: string;
  explanation: string;
};

type ActionSummary = {
  label: string;
  symbol: string;
  classes: string;
};

function normalize(value?: string | null) {
  return value?.trim().toUpperCase().replaceAll(" ", "_") ?? "";
}

function cleanLabel(value?: string | null) {
  if (!value) {
    return "Not available";
  }

  return value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getMarketSummary(
  regime?: string,
  confidence = 0,
): MarketSummary {
  const normalized = normalize(regime);

  if (
    normalized.includes("BULL") ||
    normalized.includes("UPTREND") ||
    normalized.includes("RISK_ON")
  ) {
    return {
      label: "Looking Strong",
      symbol: "↗",
      classes:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      explanation:
        confidence >= 70
          ? "The broader market trend currently appears positive."
          : "The market is showing positive signs, but confidence remains limited.",
    };
  }

  if (
    normalized.includes("BEAR") ||
    normalized.includes("DOWNTREND") ||
    normalized.includes("RISK_OFF")
  ) {
    return {
      label: "Under Pressure",
      symbol: "↘",
      classes: "border-red-400/20 bg-red-400/10 text-red-200",
      explanation:
        "The broader market is showing weakness, so extra caution may be appropriate.",
    };
  }

  if (
    normalized.includes("SIDEWAYS") ||
    normalized.includes("RANGE") ||
    normalized.includes("NEUTRAL") ||
    normalized.includes("MIXED")
  ) {
    return {
      label: "Mixed",
      symbol: "→",
      classes:
        "border-amber-400/20 bg-amber-400/10 text-amber-200",
      explanation:
        "The market does not currently have a clear direction.",
    };
  }

  return {
    label: "Being Evaluated",
    symbol: "●",
    classes: "border-white/10 bg-white/[0.06] text-white/60",
    explanation:
      "Nestrova is still evaluating the available public market data.",
  };
}

function getActionSummary(
  regime?: string,
  confidence = 0,
  risk?: string,
  veto?: boolean,
): ActionSummary {
  const normalizedRegime = normalize(regime);
  const normalizedRisk = normalize(risk);

  if (
    veto ||
    normalizedRisk === "CRITICAL" ||
    normalizedRisk === "HIGH" ||
    normalizedRegime.includes("BEAR") ||
    normalizedRegime.includes("DOWNTREND")
  ) {
    return {
      label: "Wait and Research",
      symbol: "!",
      classes:
        "border-red-400/20 bg-red-400/10 text-red-200",
    };
  }

  if (
    confidence >= 70 &&
    (normalizedRegime.includes("BULL") ||
      normalizedRegime.includes("UPTREND") ||
      normalizedRegime.includes("RISK_ON"))
  ) {
    return {
      label: "Research Opportunities",
      symbol: "✓",
      classes:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    };
  }

  return {
    label: "Watch Before Acting",
    symbol: "•",
    classes:
      "border-amber-400/20 bg-amber-400/10 text-amber-200",
  };
}

function getRiskExplanation(risk?: string) {
  switch (normalize(risk)) {
    case "LOW":
      return "Current public indicators suggest relatively limited market stress.";
    case "MEDIUM":
      return "Conditions are usable, but price swings and unexpected news remain possible.";
    case "HIGH":
      return "Market uncertainty is elevated. Avoid rushed decisions and excessive risk.";
    case "CRITICAL":
      return "Market stress is unusually high. Capital protection should take priority.";
    default:
      return "A reliable public risk classification is not currently available.";
  }
}

function getOpportunityReason(item: Opportunity) {
  if (item.score_basis) {
    return cleanLabel(item.score_basis);
  }

  const regime = normalize(item.regime);
  const risk = normalize(item.risk);

  if (
    regime.includes("BULL") ||
    regime.includes("UPTREND") ||
    regime.includes("RISK_ON")
  ) {
    return risk === "LOW"
      ? "Positive trend with relatively controlled risk."
      : "Positive trend, but risk should still be monitored.";
  }

  if (
    regime.includes("SIDEWAYS") ||
    regime.includes("RANGE") ||
    regime.includes("NEUTRAL")
  ) {
    return "Worth watching while the market searches for direction.";
  }

  return "Highlighted by Nestrova's public opportunity scanner.";
}

export default function ExecutiveBrief({
  market,
  opportunities = [],
  council,
  system,
}: ExecutiveBriefProps) {
  const confidence = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        market?.confidence ?? council?.confidence ?? 0,
      ),
    ),
  );

  const marketSummary = getMarketSummary(
    market?.regime,
    confidence,
  );

  const actionSummary = getActionSummary(
    market?.regime,
    confidence,
    market?.risk,
    council?.veto,
  );

  const topOpportunities = [...opportunities]
    .sort(
      (a, b) =>
        (b.opportunity_score ?? 0) -
        (a.opportunity_score ?? 0),
    )
    .slice(0, 3);

  const recommendation =
    system?.recommended_action &&
    system.recommended_action.trim().length > 0
      ? cleanLabel(system.recommended_action)
      : actionSummary.label;

  return (
    <section className="relative mx-auto max-w-[1480px] px-5 py-8 md:px-8">
      <article className="overflow-hidden rounded-[42px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.085),rgba(255,255,255,0.035))] p-7 shadow-[0_30px_100px_rgba(0,0,0,0.35)] md:p-9">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-cyan-300 text-xs font-black text-black">
                AI
              </span>

              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-cyan-200">
                Executive Brief
              </p>
            </div>

            <h2 className="mt-6 max-w-3xl text-[clamp(1.45rem,4vw,2.25rem)] font-semibold tracking-[-0.055em] md:text-5xl break-words [overflow-wrap:anywhere] leading-tight">
              What the market means today.
            </h2>

            <p className="mt-4 max-w-3xl text-base leading-7 text-white/50">
              A plain-English summary of Nestrova&apos;s public
              market research. No brokerage connection or trading
              account is required.
            </p>
          </div>

          <div
            className={`inline-flex items-center gap-3 self-start rounded-full border px-5 py-3 text-sm font-bold ${marketSummary.classes}`}
          >
            <span className="text-lg">
              {marketSummary.symbol}
            </span>
            Today&apos;s Market: {marketSummary.label}
          </div>
        </div>

        <div className="mt-9 grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[34px] border border-white/10 bg-black/25 p-6 md:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Simple Market Summary
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5">
                <p className="text-xs text-white/38">
                  Market condition
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                  {marketSummary.label}
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5">
                <p className="text-xs text-white/38">
                  AI confidence
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                  {confidence}%
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5">
                <p className="text-xs text-white/38">
                  Current risk
                </p>
                <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                  {cleanLabel(market?.risk)}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-[26px] border border-white/10 bg-white/[0.035] p-5">
              <p className="text-sm font-semibold text-white/80">
                What does this mean?
              </p>

              <p className="mt-3 text-sm leading-7 text-white/48">
                {marketSummary.explanation}
              </p>

              <p className="mt-2 text-sm leading-7 text-white/48">
                {getRiskExplanation(market?.risk)}
              </p>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold text-white/45">
                  Confidence level
                </p>
                <p className="text-sm font-semibold">
                  {confidence}/100
                </p>
              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-400 shadow-[0_0_22px_rgba(34,211,238,0.65)]"
                  style={{ width: `${confidence}%` }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[34px] border border-white/10 bg-black/25 p-6 md:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              What Should I Do?
            </p>

            <div
              className={`mt-5 rounded-[26px] border p-5 ${actionSummary.classes}`}
            >
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-current/20 bg-black/15 text-xl font-black">
                  {actionSummary.symbol}
                </span>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-65">
                    Suggested next step
                  </p>
                  <p className="mt-1 text-xl font-semibold">
                    {recommendation}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <span className="mt-0.5 text-emerald-300">
                  ✓
                </span>
                <p className="text-sm leading-6 text-white/52">
                  Research assets showing strong public opportunity
                  scores.
                </p>
              </div>

              <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <span className="mt-0.5 text-amber-200">
                  !
                </span>
                <p className="text-sm leading-6 text-white/52">
                  Review the risk level and avoid decisions based on
                  one signal alone.
                </p>
              </div>

              <div className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <span className="mt-0.5 text-cyan-200">
                  i
                </span>
                <p className="text-sm leading-6 text-white/52">
                  Nestrova provides research and education, not
                  personalized financial advice.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-[34px] border border-white/10 bg-black/25 p-6 md:p-7">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                Top Opportunities
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                Assets worth researching next.
              </h3>
            </div>

            <p className="text-xs text-white/30">
              Ranked from public intelligence data
            </p>
          </div>

          {topOpportunities.length > 0 ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {topOpportunities.map((item, index) => (
                <div
                  key={`${item.symbol}-${index}`}
                  className="rounded-[26px] border border-white/10 bg-white/[0.045] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-white/30">
                        #{index + 1} Opportunity
                      </p>

                      <p className="mt-2 text-2xl font-semibold">
                        {item.symbol ?? "Unknown"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-right">
                      <p className="text-[9px] uppercase tracking-[0.12em] text-cyan-200/60">
                        AI Score
                      </p>
                      <p className="mt-1 font-bold text-cyan-200">
                        {Math.round(item.opportunity_score ?? 0)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-semibold text-white/65">
                      Why is it here?
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/42">
                      {getOpportunityReason(item)}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold text-white/45">
                      {cleanLabel(item.regime)}
                    </span>

                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold text-white/45">
                      {cleanLabel(item.risk)} risk
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-[24px] border border-white/10 bg-white/[0.035] p-5 text-sm text-white/42">
              Nestrova is currently evaluating public market
              opportunities.
            </div>
          )}
        </div>
      </article>
    </section>
  );
}