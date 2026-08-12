export const dynamic = "force-dynamic";


import {
  getPublicOpportunities,
} from "@/lib/research/publicResearch";

import Link from "next/link";

type PublicOpportunity = {
  symbol?: string;
  name?: string;
  asset_type?: string;
  score?: number;
  weighted_score?: number;
  confidence?: number;
  risk?: string;
  status?: string;
  research_style?: string;
  research_version?: string;
  research_reasons?: string[];
};

type PublicState = {
  generated_at?: string;
  opportunities?: PublicOpportunity[];
  top_opportunities?: PublicOpportunity[];
};

const API_BASE_URL =
  process.env.NESTROVA_TRADING_API_URL ||
  "https://api.nestrova.com";

function cleanLabel(value?: string) {
  if (!value) return "Unclassified";

  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    );
}

async function loadState(): Promise<PublicState | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/core/state`,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(
      "research_evidence_failed",
      error,
    );

    return null;
  }
}

export default async function ResearchEvidencePage() {
  const state = await loadState();

  const opportunities =
    getPublicOpportunities(
      state,
    );

  const evidenceItems =
    opportunities
      .flatMap((item) =>
        (
          item.research_reasons ?? []
        ).map((reason, index) => ({
          symbol:
            item.symbol ||
            item.name ||
            "Discovery",
          assetType:
            item.asset_type,
          researchStyle:
            item.research_style,
          version:
            item.research_version,
          confidence: Math.round(
            Number(
              item.confidence ??
                item.weighted_score ??
                item.score ??
                0,
            ),
          ),
          risk:
            item.risk,
          reason,
          index,
        })),
      )
      .sort(
        (a, b) =>
          b.confidence -
          a.confidence,
      );

  const uniqueAssets =
    new Set(
      evidenceItems.map(
        (item) => item.symbol,
      ),
    ).size;

  const highConfidence =
    evidenceItems.filter(
      (item) =>
        item.confidence >= 80,
    ).length;

  const averageConfidence =
    evidenceItems.length > 0
      ? Math.round(
          evidenceItems.reduce(
            (sum, item) =>
              sum + item.confidence,
            0,
          ) /
            evidenceItems.length,
        )
      : 0;

  return (
    <main className="min-h-screen bg-[#050607] text-white">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-[1480px] px-5 py-16 md:px-8 md:py-20">
          <Link
            href="/research"
            className="text-sm font-semibold text-white/40 transition hover:text-white"
          >
            ← Research Feed
          </Link>

          <div className="mt-8 max-w-4xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-200/65">
              Evidence Tracking
            </p>

            <h1 className="mt-4 text-5xl font-semibold tracking-[-0.065em] md:text-7xl">
              Trace the reasons behind every signal.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-white/45">
              Public research evidence is surfaced
              separately from the final score so
              users can inspect why a discovery
              received its confidence level.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              [
                "Evidence Signals",
                evidenceItems.length,
              ],
              [
                "Assets Covered",
                uniqueAssets,
              ],
              [
                "High Confidence",
                highConfidence,
              ],
              [
                "Avg Confidence",
                `${averageConfidence}%`,
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5"
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/28">
                  {label}
                </p>

                <p className="mt-3 text-2xl font-black tracking-[-0.04em]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-5 py-12 md:px-8">
        {evidenceItems.length > 0 ? (
          <div className="space-y-4">
            {evidenceItems.map(
              (item, rowIndex) => (
                <article
                  key={`${item.symbol}-${item.index}-${rowIndex}`}
                  className="rounded-[24px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] p-5 md:p-6"
                >
                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-violet-300/15 bg-violet-300/[0.07] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-violet-200/70">
                          {cleanLabel(
                            item.assetType,
                          )}
                        </span>

                        <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.13em] text-white/35">
                          {cleanLabel(
                            item.researchStyle,
                          )}
                        </span>
                      </div>

                      <h2 className="mt-4 text-2xl font-black tracking-[-0.04em]">
                        {item.symbol}
                      </h2>

                      <p className="mt-4 max-w-4xl text-sm leading-7 text-white/60">
                        {item.reason}
                      </p>
                    </div>

                    <div className="grid shrink-0 grid-cols-2 gap-3 md:w-[260px]">
                      <div className="rounded-[18px] border border-cyan-300/15 bg-cyan-300/[0.06] p-4">
                        <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-cyan-200/45">
                          Confidence
                        </p>

                        <p className="mt-2 text-xl font-black text-cyan-100">
                          {item.confidence}%
                        </p>
                      </div>

                      <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[9px] font-bold uppercase tracking-[0.13em] text-white/28">
                          Risk
                        </p>

                        <p className="mt-2 text-sm font-bold text-white/65">
                          {cleanLabel(
                            item.risk,
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
                    <p className="text-xs text-white/28">
                      Engine:{" "}
                      {item.version ||
                        "Public research"}
                    </p>

                    <Link
                      href={`/trading/assets/${encodeURIComponent(
                        item.symbol,
                      )}`}
                      className="text-sm font-semibold text-white/60 transition hover:text-white"
                    >
                      Open full intelligence →
                    </Link>
                  </div>
                </article>
              ),
            )}
          </div>
        ) : (
          <div className="rounded-[30px] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="font-semibold text-white/65">
              No public evidence is available.
            </p>

            <p className="mt-2 text-sm text-white/30">
              Evidence will appear when research
              opportunities publish public reasons.
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-[1480px] px-5 pb-16 md:px-8">
        <div className="rounded-[26px] border border-cyan-300/15 bg-cyan-300/[0.05] p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-200/60">
            Evidence Standard
          </p>

          <p className="mt-3 max-w-4xl text-sm leading-7 text-white/40">
            Evidence entries are explanations
            published by sanitized public research
            systems. They should be reviewed together
            with confidence, risk, market context,
            and competing evidence rather than treated
            as guaranteed predictions.
          </p>
        </div>
      </section>
    </main>
  );
}

