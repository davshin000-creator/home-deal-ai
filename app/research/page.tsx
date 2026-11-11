export const dynamic = "force-dynamic";

import {
  loadResearchPublicState,
  type ResearchPublicState,
} from "@/lib/research/public-gateway";

import ResearchUsagePanel from "@/components/research/ResearchUsagePanel";
import UserAwareNestrovaShell from "@/components/shell/UserAwareNestrovaShell";

import {
  getPublicOpportunities,
  type PublicOpportunity,
} from "@/lib/research/publicResearch";
import ResearchQuickSearch from "@/components/research/ResearchQuickSearch";
import Link from "next/link";

type PublicState = {
  schema_version?: string;
  generated_at?: string;
  opportunities?: PublicOpportunity[];
  top_opportunities?: PublicOpportunity[];
  market?: {
    regime?: string;
    research_style?: string;
  };
  research?: {
    strategy_mode?: string;
    total_count?: number;
    verified_count?: number;
    research_count?: number;
  };
};

function cleanLabel(value?: string) {
  if (!value) return "Research";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

function confidenceTone(
  confidence: number,
) {
  if (confidence >= 80) {
    return {
      label: "High Confidence",
      className:
        "border-emerald-300/20 bg-emerald-300/10 text-emerald-200",
    };
  }

  if (confidence >= 65) {
    return {
      label: "Moderate Confidence",
      className:
        "border-cyan-300/20 bg-cyan-300/10 text-cyan-100",
    };
  }

  return {
    label: "Monitoring",
    className:
      "border-amber-300/20 bg-amber-300/10 text-amber-100",
  };
}

export default async function ResearchPage() {
  const state: ResearchPublicState | null =
    await loadResearchPublicState();

  const discoveries =
    getPublicOpportunities(state)
      .sort(
        (a, b) =>
          Number(
            b.opportunity_score ??
              b.confidence ??
              b.weighted_score ??
              b.score ??
              0,
          ) -
          Number(
            a.opportunity_score ??
              a.confidence ??
              a.weighted_score ??
              a.score ??
              0,
          ),
      )
      .slice(0, 6);

  const averageConfidence =
    discoveries.length > 0
      ? Math.round(
          discoveries.reduce(
            (sum, item) =>
              sum +
              Number(
                item.confidence ??
                  item.opportunity_score ??
                  item.weighted_score ??
                  item.score ??
                  0,
              ),
            0,
          ) / discoveries.length,
        )
      : 0;

  const evidenceCount =
    discoveries.reduce(
      (sum, item) =>
        sum +
        (item.research_reasons?.length ??
          0),
      0,
    );

  const generatedAt =
    state?.generated_at
      ? new Date(
          state.generated_at,
        ).toLocaleString("en-US")
      : "Unavailable";

  return (
    <UserAwareNestrovaShell
      title="Research"
      subtitle="AI research and market intelligence."
    >
      <div className="min-h-screen bg-[#0d1724] text-white">
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-violet-400/[0.08] blur-3xl" />
        <div className="pointer-events-none absolute right-0 top-10 h-96 w-96 rounded-full bg-cyan-400/[0.06] blur-3xl" />

        <div className="relative mx-auto max-w-[1480px] px-5 py-8 md:px-8 md:py-10">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-4xl">


              <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] md:text-4xl">
                Research any asset.
              </h1>

              <p className="nestrova-research-intro mt-3 max-w-xl text-sm leading-6 text-slate-300">
  Search a stock or crypto symbol for a clear, evidence-based outlook.
</p>

              <ResearchQuickSearch />
            </div>

            <p className="self-end text-xs leading-6 text-slate-400">Source: Public Nestrova Gateway | Updated: {generatedAt}</p>
          </div>

          <details className="mt-6 rounded-xl border border-[#34475a]/55 bg-[#132334]/55 px-4 py-3">
  <summary className="cursor-pointer text-sm font-medium text-slate-300">Research coverage and metrics</summary>
<div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              [
                "Active Discoveries",
                discoveries.length,
              ],
              [
                "Evidence Signals",
                evidenceCount,
              ],
              [
                "Avg Confidence",
                `${averageConfidence}%`,
              ],
              [
                "Market Regime",
                cleanLabel(
                  state?.market?.regime,
                ),
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[24px] border border-[#34475a]/70 bg-[#172636]/85 p-5"
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/28">
                  {label}
                </p>

                <p className="mt-3 text-2xl font-black tracking-[-0.04em] text-white/82">
                  {value}
                </p>
              </div>
            ))}
          </div>
</details>
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-5 py-12 md:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200/60">
              Latest Research
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] md:text-4xl">
              Latest signals
            </h2>
          </div>

          <Link
            href="/trading/markets"
            className="text-sm font-semibold text-violet-200/65 transition hover:text-violet-200"
          >
            Explore all markets →
          </Link>
        </div>

        {discoveries.length > 0 ? (
          <div className="nestrova-research-signal-grid mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {discoveries.slice(0, 3).map(
              (item, index) => {
                const confidence =
                  Math.round(
                    Number(
                      item.confidence ??
                        item.opportunity_score ??
                        item.weighted_score ??
                        item.score ??
                        0,
                    ),
                  );

                const tone =
                  confidenceTone(
                    confidence,
                  );

                return (
                  <Link
                    key={`${item.symbol ?? "research"}-${index}`}
                    href={
                      item.symbol
                        ? `/trading/assets/${encodeURIComponent(
                            item.symbol,
                          )}`
                        : "/trading/markets"
                    }
                    className="group rounded-[26px] border border-[#34475a]/70 bg-[#172636]/85 p-5 transition hover:-translate-y-1 hover:border-violet-300/20 hover:bg-white/[0.065]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/25">
                          {cleanLabel(
                            item.asset_type,
                          )}
                        </p>

                        <h3 className="mt-2 truncate text-2xl font-black tracking-[-0.04em]">
                          {item.symbol ||
                            item.asset_name ||
                            item.name ||
                            "Research"}
                        </h3>
                      </div>

                      <span
                        className={`shrink-0 rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] ${tone.className}`}
                      >
                        {confidence}%
                      </span>
                    </div>

                    <div className="mt-5">

                      <p className="mt-2 text-sm font-semibold text-white/60">
                        {cleanLabel(
                          item.research_style,
                        )}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {item.regime ? (
                          <span className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-2.5 py-1 text-[9px] font-semibold text-cyan-100/65">
                            {cleanLabel(item.regime)}
                          </span>
                        ) : null}

                        {item.risk ? (
                          <span className="rounded-full border border-amber-300/15 bg-amber-300/[0.06] px-2.5 py-1 text-[9px] font-semibold text-amber-100/65">
                            {cleanLabel(item.risk)} Risk
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-xs text-white/55">
                        {tone.label}
                      </span>

                      <span className="text-sm font-semibold text-violet-200/60 transition group-hover:text-violet-200">
                        View →
                      </span>
                    </div>
                  </Link>
                );
              },
            )}
          </div>
        ) : (
          <div className="mt-7 rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-9 text-center">
            <p className="font-semibold text-white/65">
              No research is available right now.
            </p>

            <p className="mt-2 text-sm text-white/32">
              New market research will appear here
              when Nestrova publishes it.
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1480px] px-5 pb-16 md:px-8">
        <div className="mb-8">
          <ResearchUsagePanel />
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200/60">
            Research Tools
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">
            Research tools
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/40">
            Open additional research tools when you need more detail.
          </p>
        </div>

        <details className="nestrova-tools-disclosure mt-5 rounded-2xl border border-[#34475a]/60 bg-[#132334]/70 px-5 py-4">
  <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3 text-sm font-semibold text-slate-100 focus-visible:outline-2 focus-visible:outline-[#68d4c5]">
    <span>Show research tools</span>
    <span className="text-xs font-normal text-slate-400">Deep Research · AI Council · Compare</span>
  </summary>
  <div className="pt-4">
<div className="mt-7 grid gap-5 lg:grid-cols-3">
          {[
            {
              title: "Deep Research",
              description:
                "Generate a structured AI research report for one stock or crypto asset.",
              href: "/research/deep",
              action: "Start Research",
            },
            {
              title: "AI Council",
              description:
                "See multiple AI perspectives and a combined research view.",
              href: "/research/council",
              action: "Open Council",
            },
            {
              title: "Compare",
              description:
                "Compare two assets side by side using the same research framework.",
              href: "/research/compare",
              action: "Compare Assets",
            },
          ].map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group rounded-[30px] border border-[#34475a]/70 bg-[#172636]/90 p-6 transition hover:-translate-y-1 hover:border-violet-300/20 hover:bg-white/[0.065]"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-200/55">
                Research
              </p>

              <h3 className="mt-4 text-2xl font-black tracking-[-0.045em]">
                {item.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-white/38">
                {item.description}
              </p>

              <p className="mt-6 text-sm font-semibold text-violet-200/70 transition group-hover:text-violet-200">
                {item.action} →
              </p>
            </Link>
          ))}
        </div>
  </div>
</details>

        <details className="mt-7 rounded-[28px] border border-[#34475a]/70 bg-[#172636]/75">
          <summary className="cursor-pointer px-6 py-5 text-sm font-semibold text-white/55">
            Advanced Research
          </summary>

          <div className="border-t border-white/10 p-5">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Saved Research",
                  href: "/research/saved",
                },
                {
                  title: "Research Watch",
                  href: "/research/watch",
                },
                {
                  title: "Research Alerts",
                  href: "/research/alerts",
                },
                {
                  title: "Patterns",
                  href: "/research/patterns",
                },
                {
                  title: "Evidence",
                  href: "/research/evidence",
                },
                {
                  title: "Models",
                  href: "/research/models",
                },
              ].map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="rounded-[20px] border border-[#34475a]/60 bg-[#112132]/90 px-4 py-4 text-sm font-semibold text-white/55 transition hover:bg-white/[0.05] hover:text-white"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </details>

        <div className="mt-8 rounded-[24px] border border-cyan-300/15 bg-cyan-300/[0.05] p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200/65">
            Public Research Boundary
          </p>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-white/42">
            Nestrova Research displays sanitized,
            read-only intelligence from public
            research systems. It does not expose
            private accounts, positions, execution
            controls, private strategies, or
            brokerage credentials.
          </p>
        </div>
      </section>
    </div>
    </UserAwareNestrovaShell>
  );
}