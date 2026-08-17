import {
  AlertIcon,
  BrainIcon,
  GaugeIcon,
  PulseIcon,
  ShieldIcon,
  SparkIcon,
  TargetIcon,
} from "@/components/ui/NestrovaIcons";

import {
  GlassPanel,
  MetricTile,
  SectionHeader,
  StatusChip,
} from "@/components/ui/nestrova";

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
      symbol: "UP",
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
      symbol: "DOWN",
      classes:
        "border-red-400/20 bg-red-400/10 text-red-200",
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
      symbol: "MIX",
      classes:
        "border-amber-400/20 bg-amber-400/10 text-amber-200",
      explanation:
        "The market does not currently have a clear direction.",
    };
  }

  return {
    label: "Being Evaluated",
    symbol: "AI",
    classes:
      "border-white/10 bg-white/[0.06] text-white/60",
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
      symbol: "GO",
      classes:
        "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    };
  }

  return {
    label: "Watch Before Acting",
    symbol: "WAIT",
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
      <SectionHeader
        eyebrow="Executive Brief"
        title="What the market means today."
        description="A plain-English summary of Nestrova public market intelligence, risk context, and recommended next action."
        tone="violet"
        icon={<BrainIcon className="h-4 w-4" />}
        action={
          <StatusChip
            tone={
              marketSummary.label === "Looking Strong"
                ? "emerald"
                : marketSummary.label === "Under Pressure"
                  ? "red"
                  : "amber"
            }
            icon={<PulseIcon className="h-3.5 w-3.5" />}
            className="px-4 py-2 text-[11px]"
          >
            Today&apos;s Market: {marketSummary.label}
          </StatusChip>
        }
      />

        <div className="mt-7 grid min-w-0 flex-1 gap-5">
          <div className="rounded-[34px] border border-white/10 bg-black/25 p-6 md:p-7">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Simple Market Summary
            </p>

            <div className="mt-6 grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-3">
              <MetricTile
                compact
                label="Market Pulse"
                value={marketSummary.label}
                detail={cleanLabel(market?.regime)}
                icon={<PulseIcon className="h-4 w-4" />}
                tone={
                  marketSummary.label === "Looking Strong"
                    ? "emerald"
                    : marketSummary.label === "Under Pressure"
                      ? "red"
                      : "amber"
                }
              />

              <MetricTile
                compact
                label="AI Confidence"
                value={`${confidence}%`}
                detail="Current research conviction"
                icon={<GaugeIcon className="h-4 w-4" />}
                tone="cyan"
              />

              <MetricTile
                compact
                label="Risk Outlook"
                value={cleanLabel(market?.risk)}
                detail="Current public market risk"
                icon={<ShieldIcon className="h-4 w-4" />}
                tone={
                  normalize(market?.risk) === "LOW"
                    ? "emerald"
                    : normalize(market?.risk) === "MEDIUM"
                      ? "amber"
                      : "red"
                }
              />
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
              className={`mt-5 min-w-0 rounded-[26px] border p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] ${actionSummary.classes}`}
            >
              <div className="flex min-w-0 items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-current/20 bg-black/15">
                  <TargetIcon className="h-5 w-5" />
                </span>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] opacity-65">
                    Current Research View
                  </p>

                  <p className="mt-2 break-words text-xl font-black leading-tight [overflow-wrap:anywhere]">
                    {recommendation}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex min-w-0 gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] border border-emerald-300/15 bg-emerald-300/10 text-emerald-200">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M5 12.5l4 4L19 7" />
                  </svg>
                </span>
                <p className="min-w-0 break-words text-sm leading-6 text-white/52 [overflow-wrap:anywhere]">
                  Research assets showing strong public opportunity
                  scores.
                </p>
              </div>

              <div className="flex min-w-0 gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] border border-amber-300/15 bg-amber-300/10 text-amber-200">
                  <AlertIcon className="h-4 w-4" />
                </span>
                <p className="min-w-0 break-words text-sm leading-6 text-white/52 [overflow-wrap:anywhere]">
                  Review the risk level and avoid decisions based on
                  one signal alone.
                </p>
              </div>

              <div className="flex min-w-0 gap-3 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] border border-cyan-300/15 bg-cyan-300/10 text-cyan-200">
                  <BrainIcon className="h-4 w-4" />
                </span>
                <p className="min-w-0 break-words text-sm leading-6 text-white/52 [overflow-wrap:anywhere]">
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
            <div className="mt-6 grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-3">
              {topOpportunities.map((item, index) => (
                <div
                  key={`${item.symbol}-${index}`}
                  className="flex min-w-0 flex-col overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.045] p-5 xl:p-6"
                >
                  <div className="min-w-0">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/30">
                      #{index + 1} Opportunity
                    </p>

                    <p className="mt-4 min-w-0 whitespace-nowrap text-[clamp(1.45rem,2.6vw,2rem)] font-black leading-none tracking-[-0.045em] text-white">
                      {item.symbol ?? "Unknown"}
                    </p>
                  </div>

                  <div className="mt-5 flex-1">
                    <p className="text-xs font-semibold text-white/65">
                      Why is it here?
                    </p>

                    <p className="mt-2 break-words text-[13px] leading-5 text-white/42 [overflow-wrap:anywhere]">
                      {getOpportunityReason(item)}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.055] px-3 py-1 text-[10px] font-semibold text-cyan-100/65">
                      {cleanLabel(item.regime)}
                    </span>

                    <span className="rounded-full border border-amber-300/15 bg-amber-300/[0.055] px-3 py-1 text-[10px] font-semibold text-amber-100/65">
                      {cleanLabel(item.risk)} risk
                    </span>
                  </div>

                  <div className="mt-5 flex items-end justify-between border-t border-white/[0.08] pt-4">
                    <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-cyan-200/50">
                      AI Score
                    </p>

                    <p className="text-xl font-black leading-none text-cyan-200">
                      {Math.round(item.opportunity_score ?? 0)}
                    </p>
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
