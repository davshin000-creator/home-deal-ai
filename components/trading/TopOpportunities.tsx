import Link from "next/link";
import {
  ArrowRightIcon,
  SparkIcon,
} from "@/components/ui/NestrovaIcons";
import {
  GlassPanel,
  SectionHeader,
} from "@/components/ui/nestrova";

type Opportunity = {
  symbol?: string;
  asset_name?: string;
  asset_type?: string;

  opportunity_score?: number;
  confidence?: number;

  risk?: string;
  regime?: string;

  direction?: string;
  direction_label?: string;

  outlook?: string;
  outlook_label?: string;
  outlook_summary?: string;

  time_horizon?: string;

  positive_factors?: string[];
  watch_factors?: string[];

  research_reasons?: string[];
};

type TopOpportunitiesProps = {
  opportunities: Opportunity[];
};

function cleanLabel(value?: string) {
  return String(value ?? "")
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function getDirection(
  opportunity: Opportunity,
) {
  const direction = String(
    opportunity.direction ?? "",
  )
    .trim()
    .toUpperCase();

  if (direction === "UP") {
    return {
      label:
        opportunity.direction_label ||
        "Likely Up",
      className:
        "border-emerald-300/20 bg-emerald-300/10 text-emerald-100",
      dot: "bg-emerald-300",
    };
  }

  if (direction === "DOWN") {
    return {
      label:
        opportunity.direction_label ||
        "Likely Down",
      className:
        "border-red-300/20 bg-red-300/10 text-red-100",
      dot: "bg-red-300",
    };
  }

  return {
    label:
      opportunity.direction_label ||
      "Mixed",
    className:
      "border-white/10 bg-white/[0.05] text-white/60",
    dot: "bg-white/35",
  };
}

function riskClasses(value?: string) {
  const risk = String(value ?? "")
    .trim()
    .toUpperCase();

  if (risk === "LOW") {
    return "text-emerald-200";
  }

  if (
    risk === "HIGH" ||
    risk === "CRITICAL"
  ) {
    return "text-red-200";
  }

  return "text-amber-100";
}

function confidenceLabel(
  confidence: number,
) {
  if (confidence >= 85) {
    return "High";
  }

  if (confidence >= 70) {
    return "Good";
  }

  if (confidence >= 55) {
    return "Moderate";
  }

  return "Low";
}

function getReasons(
  opportunity: Opportunity,
) {
  if (
    Array.isArray(
      opportunity.positive_factors,
    ) &&
    opportunity.positive_factors.length > 0
  ) {
    return opportunity.positive_factors.slice(
      0,
      3,
    );
  }

  if (
    Array.isArray(
      opportunity.research_reasons,
    )
  ) {
    return opportunity.research_reasons.slice(
      0,
      3,
    );
  }

  return [];
}

export default function TopOpportunities({
  opportunities,
}: TopOpportunitiesProps) {
  const rankedOpportunities = [
    ...opportunities,
  ]
    .sort((first, second) => {
      const confidenceDifference =
        Number(second.confidence ?? 0) -
        Number(first.confidence ?? 0);

      if (confidenceDifference !== 0) {
        return confidenceDifference;
      }

      return (
        Number(
          second.opportunity_score ?? 0,
        ) -
        Number(
          first.opportunity_score ?? 0,
        )
      );
    })
    .slice(0, 6);

  const lead =
    rankedOpportunities[0] ?? null;

  const remaining =
    rankedOpportunities.slice(1);

  return (
    <GlassPanel
      id="top-opportunities"
      tone="cyan"
      className="scroll-mt-24"
      contentClassName="min-w-0 p-6 md:p-8"
    >
      <SectionHeader
        eyebrow="Nestrova AI Picks"
        title="Stocks Nestrova likes right now."
        description="A simpler view of the market: direction, confidence, risk, and the main reasons behind each AI outlook."
        tone="cyan"
        icon={
          <SparkIcon className="h-4 w-4" />
        }
        action={
          <Link
            href="/trading/markets"
            className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.055] px-5 py-3 text-sm font-semibold text-white/65 transition hover:border-white/20 hover:bg-white/[0.1] hover:text-white"
          >
            Explore all markets
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        }
      />

      {lead ? (
        <div className="mt-8">
          {(() => {
            const direction =
              getDirection(lead);

            const confidence =
              Math.round(
                Number(
                  lead.confidence ?? 0,
                ),
              );

            const reasons =
              getReasons(lead);

            return (
              <Link
                href={`/trading/assets/${encodeURIComponent(
                  lead.symbol ?? "",
                )}`}
                className="group block overflow-hidden rounded-[30px] border border-cyan-300/15 bg-[linear-gradient(145deg,rgba(34,211,238,0.09),rgba(255,255,255,0.025))] transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/30"
              >
                <div className="p-6 md:p-8">
                  <div className="flex flex-col gap-7 xl:flex-row xl:items-start xl:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-cyan-100/60">
                          Top AI Outlook
                        </span>

                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${direction.className}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${direction.dot}`}
                          />

                          {direction.label}
                        </span>
                      </div>

                      <div className="mt-5 flex flex-wrap items-end gap-x-4 gap-y-2">
                        <h3 className="text-5xl font-black tracking-[-0.06em] text-white md:text-6xl">
                          {lead.symbol}
                        </h3>

                        {lead.asset_name &&
                        lead.asset_name !==
                          lead.symbol ? (
                          <p className="pb-1 text-sm font-semibold text-white/35">
                            {lead.asset_name}
                          </p>
                        ) : null}
                      </div>

                      <div className="mt-5 flex flex-wrap items-center gap-3">
                        <p className="text-2xl font-black tracking-[-0.035em] text-cyan-100">
                          {lead.outlook_label ||
                            cleanLabel(
                              lead.outlook,
                            ) ||
                            "Current AI Outlook"}
                        </p>

                        <span className="text-white/20">
                          •
                        </span>

                        <p className="text-sm font-semibold text-white/45">
                          {lead.time_horizon ||
                            "1-4 weeks"}
                        </p>
                      </div>

                      <p className="mt-5 max-w-2xl text-sm leading-7 text-white/48 md:text-base">
                        {lead.outlook_summary ||
                          `Nestrova currently sees a constructive setup for ${lead.symbol}, based on the latest public market research.`}
                      </p>
                    </div>

                    <div className="grid min-w-0 grid-cols-3 gap-3 xl:w-[430px]">
                      <div className="rounded-[20px] border border-cyan-300/15 bg-black/20 p-4">
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                          Confidence
                        </p>

                        <p className="mt-2 text-2xl font-black text-cyan-100">
                          {confidence}%
                        </p>

                        <p className="mt-1 text-[10px] text-white/28">
                          {confidenceLabel(
                            confidence,
                          )}
                        </p>
                      </div>

                      <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                          Risk
                        </p>

                        <p
                          className={`mt-2 text-lg font-black ${riskClasses(
                            lead.risk,
                          )}`}
                        >
                          {cleanLabel(
                            lead.risk,
                          ) || "—"}
                        </p>
                      </div>

                      <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                          AI Score
                        </p>

                        <p className="mt-2 text-lg font-black text-white/75">
                          {Math.round(
                            Number(
                              lead.opportunity_score ??
                                0,
                            ),
                          )}
                        </p>

                        <p className="mt-1 text-[10px] text-white/25">
                          supporting metric
                        </p>
                      </div>
                    </div>
                  </div>

                  {reasons.length > 0 ? (
                    <div className="mt-7 border-t border-white/10 pt-6">
                      <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/28">
                        Why Nestrova likes it
                      </p>

                      <div className="mt-4 grid gap-3 md:grid-cols-3">
                        {reasons.map(
                          (reason) => (
                            <div
                              key={reason}
                              className="flex gap-3 rounded-[18px] border border-white/8 bg-black/15 p-4"
                            >
                              <span className="mt-1 text-emerald-200">
                                +
                              </span>

                              <p className="text-xs leading-5 text-white/45">
                                {reason}
                              </p>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-xs text-white/25">
                      Open the full analysis for
                      factors, risks, chart and AI
                      reasoning.
                    </p>

                    <span className="shrink-0 text-sm font-bold text-cyan-200/70 transition group-hover:text-cyan-100">
                      Full Analysis →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })()}

          {remaining.length > 0 ? (
            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {remaining.map(
                (opportunity, index) => {
                  const direction =
                    getDirection(
                      opportunity,
                    );

                  const confidence =
                    Math.round(
                      Number(
                        opportunity.confidence ??
                          0,
                      ),
                    );

                  return (
                    <Link
                      key={`${opportunity.symbol ?? "unknown"}-${index}`}
                      href={`/trading/assets/${encodeURIComponent(
                        opportunity.symbol ??
                          "",
                      )}`}
                      className="group rounded-[24px] border border-white/10 bg-black/20 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-white/[0.045]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-2xl font-black tracking-[-0.045em]">
                            {opportunity.symbol}
                          </p>

                          <p className="mt-1 truncate text-[10px] text-white/25">
                            {opportunity.asset_name &&
                            opportunity.asset_name !==
                              opportunity.symbol
                              ? opportunity.asset_name
                              : cleanLabel(
                                  opportunity.asset_type,
                                )}
                          </p>
                        </div>

                        <span className="text-[10px] font-bold text-white/20">
                          #{index + 2}
                        </span>
                      </div>

                      <div className="mt-5">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold ${direction.className}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${direction.dot}`}
                          />

                          {direction.label}
                        </span>
                      </div>

                      <p className="mt-4 text-sm font-bold text-white/70">
                        {opportunity.outlook_label ||
                          cleanLabel(
                            opportunity.outlook,
                          ) ||
                          "AI Outlook"}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-4">
                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/22">
                            Confidence
                          </p>

                          <p className="mt-1 text-sm font-black text-cyan-100">
                            {confidence}%
                          </p>
                        </div>

                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-[0.12em] text-white/22">
                            Risk
                          </p>

                          <p
                            className={`mt-1 text-sm font-black ${riskClasses(
                              opportunity.risk,
                            )}`}
                          >
                            {cleanLabel(
                              opportunity.risk,
                            ) || "—"}
                          </p>
                        </div>
                      </div>

                      <p className="mt-5 text-xs font-semibold text-cyan-200/45 transition group-hover:text-cyan-200">
                        View analysis →
                      </p>
                    </Link>
                  );
                },
              )}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="mt-8 rounded-[24px] border border-dashed border-white/15 bg-black/20 p-8 text-center">
          <p className="font-semibold text-white/70">
            No current AI outlooks are
            available.
          </p>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Nestrova will show new market
            opportunities when enough public
            research evidence is available.
          </p>
        </div>
      )}
    </GlassPanel>
  );
}
