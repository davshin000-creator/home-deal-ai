import Link from "next/link";
import OpportunityCard, {
  type Opportunity,
} from "@/components/trading/OpportunityCard";
import {
  ArrowRightIcon,
  SparkIcon,
} from "@/components/ui/NestrovaIcons";
import {
  GlassPanel,
  SectionHeader,
} from "@/components/ui/nestrova";

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
    <GlassPanel
      id="top-opportunities"
      tone="amber"
      className="scroll-mt-24"
      contentClassName="min-w-0 p-6 md:p-8"
    >
      <SectionHeader
        eyebrow="AI-Ranked Opportunities"
        title="The strongest public market signals right now."
        description="Ranked research opportunities across U.S. stocks and crypto, based on current public intelligence."
        tone="amber"
        icon={<SparkIcon className="h-4 w-4" />}
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

      {rankedOpportunities.length > 0 ? (
        <div className="mt-8 grid auto-rows-fr gap-5 lg:grid-cols-2 2xl:grid-cols-3">
          {rankedOpportunities.map((opportunity, index) => (
            <OpportunityCard
              key={`${opportunity.symbol ?? "unknown"}-${index}`}
              opportunity={opportunity}
              rank={index + 1}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-[24px] border border-dashed border-white/15 bg-black/20 p-8 text-center">
          <p className="font-semibold text-white/70">
            No ranked opportunities are available.
          </p>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Nestrova will display new opportunities when the public market
            intelligence system detects sufficiently strong conditions.
          </p>
        </div>
      )}
    </GlassPanel>
  );
}