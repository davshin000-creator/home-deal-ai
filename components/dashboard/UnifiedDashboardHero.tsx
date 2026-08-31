import Link from "next/link";

type UnifiedDashboardHeroProps = {
  userName?: string | null;
  realEstateScore?: number;
  savedProperties?: number;
  tradingWatchlist?: number;
  aiReports?: number;
  aiBrief?: string | null;
};

function getFirstName(
  userName?: string | null,
) {
  return (
    String(userName ?? "")
      .trim()
      .split(/\s+/)[0] ||
    "Investor"
  );
}

export default function UnifiedDashboardHero({
  userName,
  realEstateScore = 0,
  savedProperties = 0,
  tradingWatchlist = 0,
  aiReports = 0,
  aiBrief,
}: UnifiedDashboardHeroProps) {
  const firstName = getFirstName(userName);

  return (
    <section className="relative overflow-hidden rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(255,255,255,0.035)_50%,rgba(34,211,238,0.07))] p-7 shadow-[0_35px_120px_rgba(0,0,0,0.35)] md:p-9">
      <div className="pointer-events-none absolute right-[-80px] top-[-100px] h-72 w-72 rounded-full bg-violet-400/15 blur-3xl" />

      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-200/70">
          Nestrova Intelligence OS
        </p>

        <h2 className="mt-4 text-4xl font-black tracking-[-0.06em] md:text-6xl">
          Welcome back, {firstName}.
        </h2>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-white/45 md:text-base">
          Your trading and real estate intelligence are organized
          into one personalized AI workspace.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-[24px] border border-white/10 bg-black/20 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200/55">
              Property Deal Score
            </p>

            <p className="mt-3 text-4xl font-black text-emerald-200">
              {Math.round(realEstateScore)}
            </p>

            <p className="mt-2 text-xs text-white/30">
              Average analyzed property score
            </p>
          </article>

          <article className="rounded-[24px] border border-white/10 bg-black/20 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-200/55">
              Saved Properties
            </p>

            <p className="mt-3 text-4xl font-black">
              {savedProperties}
            </p>

            <p className="mt-2 text-xs text-white/30">
              Properties under review
            </p>
          </article>

          <article className="rounded-[24px] border border-white/10 bg-black/20 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200/55">
              Radar Watchlist
            </p>

            <p className="mt-3 text-4xl font-black text-cyan-200">
              {tradingWatchlist}
            </p>

            <p className="mt-2 text-xs text-white/30">
              Public market assets followed
            </p>
          </article>

          <article className="rounded-[24px] border border-white/10 bg-black/20 p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-violet-200/55">
              AI Reports
            </p>

            <p className="mt-3 text-4xl font-black text-violet-200">
              {aiReports}
            </p>

            <p className="mt-2 text-xs text-white/30">
              Intelligence reports generated
            </p>
          </article>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
              Executive AI Brief
            </p>

            <p className="mt-3 text-sm leading-7 text-white/52">
              {aiBrief?.trim() ||
                "Nestrova is preparing your personalized intelligence summary."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/trading"
              className="rounded-[14px] border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-300/15"
            >
              Open Radar
            </Link>

            <Link
              href="/real-estate"
              className="rounded-[14px] border border-emerald-300/20 bg-emerald-300/10 px-5 py-3 text-sm font-bold text-emerald-100 transition hover:bg-emerald-300/15"
            >
              Open Real Estate
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
