import {
  BrainIcon,
  DollarIcon,
  GaugeIcon,
  SparkIcon,
} from "@/components/ui/NestrovaIcons";

type NegotiationResult = {
  suggested_offer?: number;
  recommended_target?: number;
  walk_away_price?: number;
  estimated_savings?: number;
  comparable_median?: number | null;
  best_match_price?: number | null;
  market_reference?: number | null;
  comparable_count?: number;
  strategy?: string;
  strategy_reasons?: string[];
};

type NegotiationAIProps = {
  negotiation?: NegotiationResult | null;
};

function money(value?: number | null) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return `$${Math.round(value).toLocaleString("en-US")}`;
}

export default function NegotiationAI({
  negotiation,
}: NegotiationAIProps) {
  if (!negotiation) {
    return null;
  }

  const metrics = [
    {
      label: "Opening Offer",
      value: money(
        negotiation.suggested_offer,
      ),
      tone:
        "border-emerald-300/15 bg-emerald-300/[0.07] text-emerald-100",
    },
    {
      label: "Target Price",
      value: money(
        negotiation.recommended_target,
      ),
      tone:
        "border-cyan-300/15 bg-cyan-300/[0.07] text-cyan-100",
    },
    {
      label: "Walk-Away Price",
      value: money(
        negotiation.walk_away_price,
      ),
      tone:
        "border-amber-300/15 bg-amber-300/[0.07] text-amber-100",
    },
    {
      label: "Estimated Savings",
      value: money(
        negotiation.estimated_savings,
      ),
      tone:
        "border-violet-300/15 bg-violet-300/[0.07] text-violet-100",
    },
  ];

  return (
    <section className="relative min-w-0 overflow-hidden rounded-[32px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(255,255,255,0.025))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] md:p-7">
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-violet-300/[0.08] blur-3xl" />

      <div className="relative">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-violet-300/20 bg-violet-300/10 text-violet-200">
                <BrainIcon className="h-5 w-5" />
              </span>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200/65">
                  Negotiation AI
                </p>

                <p className="mt-1 text-xs text-white/30">
                  Comparable-aware offer strategy
                </p>
              </div>
            </div>

            <h2 className="mt-5 break-words text-3xl font-black tracking-[-0.05em] [overflow-wrap:anywhere]">
              A disciplined offer range.
            </h2>
          </div>

          <div className="shrink-0 rounded-[18px] border border-white/10 bg-black/20 px-4 py-3 text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
              Comparable Inputs
            </p>

            <p className="mt-1 text-2xl font-black text-white/75">
              {negotiation.comparable_count ?? 0}
            </p>
          </div>
        </div>

        <div className="mt-7 grid auto-rows-fr gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <div
              key={metric.label}
              className={`min-w-0 rounded-[20px] border p-5 ${metric.tone}`}
            >
              <div className="flex items-center gap-2 opacity-60">
                <DollarIcon className="h-4 w-4" />

                <p className="text-[9px] font-bold uppercase tracking-[0.14em]">
                  {metric.label}
                </p>
              </div>

              <p className="mt-3 truncate text-2xl font-black tracking-[-0.04em]">
                {metric.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            [
              "Comparable Median",
              money(
                negotiation.comparable_median,
              ),
            ],
            [
              "Best Match Price",
              money(
                negotiation.best_match_price,
              ),
            ],
            [
              "Market Reference",
              money(
                negotiation.market_reference,
              ),
            ],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-[18px] border border-white/10 bg-black/20 p-4"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                {label}
              </p>

              <p className="mt-2 text-sm font-bold text-white/72">
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="rounded-[20px] border border-white/10 bg-black/20 p-5">
            <div className="flex items-center gap-2 text-violet-200/60">
              <SparkIcon className="h-4 w-4" />

              <p className="text-[10px] font-bold uppercase tracking-[0.16em]">
                Strategy
              </p>
            </div>

            <p className="mt-3 text-sm leading-7 text-white/52">
              {negotiation.strategy ||
                "Negotiation strategy unavailable."}
            </p>
          </div>

          <div className="rounded-[20px] border border-cyan-300/15 bg-cyan-300/[0.05] p-5">
            <div className="flex items-center gap-2 text-cyan-200/60">
              <GaugeIcon className="h-4 w-4" />

              <p className="text-[10px] font-bold uppercase tracking-[0.16em]">
                Why
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {(negotiation.strategy_reasons ?? [])
                .slice(0, 4)
                .map((reason) => (
                  <div
                    key={reason}
                    className="flex min-w-0 gap-3 text-sm leading-6 text-white/48"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />

                    <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                      {reason}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
