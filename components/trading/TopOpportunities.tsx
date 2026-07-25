import Link from "next/link";
import OpportunityCard, {
  type Opportunity,
} from "@/components/trading/OpportunityCard";

type TopOpportunitiesProps = {
  opportunities: Opportunity[];
};

export default function TopOpportunities({
  opportunities,
}: TopOpportunitiesProps) {
  const rankedOpportunities = [...opportunities]
    .sort(
      (first, second) =>
        (second.opportunity_score ?? 0) -
        (first.opportunity_score ?? 0),
    )
    .slice(0, 6);

  return (
    <section
  id="top-opportunities"
  className="relative mx-auto max-w-[1480px] scroll-mt-24 px-5 py-10 md:px-8"
>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200">
            AI-Ranked Opportunities
          </div>

          <h2 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.055em] md:text-5xl">
            The strongest market opportunities right now.
          </h2>

          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/45 md:text-base">
            Stop scanning endless charts. Nestrova ranks the markets showing
            the strongest combination of trend, momentum, confidence, and
            manageable risk.
          </p>
        </div>

        <Link
          href="/trading/markets"
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/65 transition hover:border-white/20 hover:bg-white/[0.1] hover:text-white"
        >
          Explore all markets →
        </Link>
      </div>

      {rankedOpportunities.length > 0 ? (
        <div className="mt-9 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {rankedOpportunities.map((opportunity, index) => (
            <OpportunityCard
              key={`${opportunity.symbol ?? "unknown"}-${index}`}
              opportunity={opportunity}
              rank={index + 1}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[34px] border border-white/10 bg-white/[0.05] p-8">
          <p className="font-semibold text-white/70">
            No ranked opportunities are available.
          </p>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Nestrova will display new opportunities when the public market
            intelligence system detects sufficiently strong conditions.
          </p>
        </div>
      )}
    </section>
  );
}