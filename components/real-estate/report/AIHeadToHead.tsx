import {
  BrainIcon,
  GaugeIcon,
  SparkIcon,
} from "@/components/ui/NestrovaIcons";

type ComparableProperty = {
  address?: string | null;
  price?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  square_footage?: number | null;
  year_built?: number | null;
  status?: string | null;
  distance_miles?: number | null;
  similarity_score?: number | null;
};

type AIHeadToHeadProps = {
  current: {
    address: string;
    listingPrice?: number | null;
    fairValue?: number | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    squareFootage?: number | null;
    yearBuilt?: number | null;
  };

  bestComparable?: ComparableProperty | null;
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

function numberOrDash(value?: number | null) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return value.toLocaleString("en-US");
}

export default function AIHeadToHead({
  current,
  bestComparable,
}: AIHeadToHeadProps) {
  if (!bestComparable) {
    return null;
  }

  const similarity = Math.round(
    Number(bestComparable.similarity_score ?? 0),
  );

  const rows = [
    {
      label: "Price",
      current: money(current.listingPrice),
      comparable: money(bestComparable.price),
    },
    {
      label: "Fair Value",
      current: money(current.fairValue),
      comparable: "Not analyzed",
    },
    {
      label: "Beds / Baths",
      current: `${
        current.bedrooms ?? "—"
      } / ${current.bathrooms ?? "—"}`,
      comparable: `${
        bestComparable.bedrooms ?? "—"
      } / ${bestComparable.bathrooms ?? "—"}`,
    },
    {
      label: "Square Feet",
      current: numberOrDash(
        current.squareFootage,
      ),
      comparable: numberOrDash(
        bestComparable.square_footage,
      ),
    },
    {
      label: "Year Built",
      current: String(
        current.yearBuilt ?? "—",
      ),
      comparable: String(
        bestComparable.year_built ?? "—",
      ),
    },
    {
      label: "Distance",
      current: "Subject",
      comparable:
        bestComparable.distance_miles ===
          null ||
        bestComparable.distance_miles ===
          undefined
          ? "—"
          : `${Number(
              bestComparable.distance_miles,
            ).toFixed(2)} mi`,
    },
    {
      label: "Similarity",
      current: "Reference",
      comparable: `${similarity} / 100`,
    },
    {
      label: "Market Status",
      current: "Subject",
      comparable:
        bestComparable.status || "Unknown",
    },
  ];

  return (
    <section className="relative min-w-0 overflow-hidden rounded-[32px] border border-violet-300/15 bg-[linear-gradient(145deg,rgba(139,92,246,0.09),rgba(255,255,255,0.03))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)] md:p-7">
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-violet-300/[0.08] blur-3xl" />

      <div className="relative">
        <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-violet-300/20 bg-violet-300/10 text-violet-200">
                <BrainIcon className="h-5 w-5" />
              </span>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-200/65">
                  AI Head-to-Head
                </p>

                <p className="mt-1 text-xs text-white/30">
                  Subject property vs strongest comparable
                </p>
              </div>
            </div>

            <h2 className="mt-5 break-words text-3xl font-black tracking-[-0.05em] [overflow-wrap:anywhere]">
              Current property vs best match.
            </h2>
          </div>

          <div className="shrink-0 rounded-[18px] border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-right">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-200/45">
              Match Quality
            </p>

            <p className="mt-1 text-3xl font-black text-emerald-100">
              {similarity}
            </p>
          </div>
        </div>

        <div className="mt-7 overflow-hidden rounded-[24px] border border-white/10">
          <div className="grid grid-cols-[minmax(110px,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-white/10 bg-black/25">
            <div className="p-4 text-[10px] font-bold uppercase tracking-[0.15em] text-white/28">
              Metric
            </div>

            <div className="border-l border-white/10 p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-200/45">
                Current Property
              </p>

              <p className="mt-1 truncate text-sm font-bold text-white/75">
                {current.address}
              </p>
            </div>

            <div className="border-l border-white/10 p-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-200/45">
                Best Comparable
              </p>

              <p className="mt-1 truncate text-sm font-bold text-white/75">
                {bestComparable.address ||
                  "Comparable Property"}
              </p>
            </div>
          </div>

          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-[minmax(110px,0.8fr)_minmax(0,1fr)_minmax(0,1fr)] border-b border-white/[0.07] last:border-b-0"
            >
              <div className="p-4 text-xs font-semibold text-white/35">
                {row.label}
              </div>

              <div className="border-l border-white/[0.07] p-4 text-sm font-bold text-white/72">
                {row.current}
              </div>

              <div className="border-l border-white/[0.07] p-4 text-sm font-bold text-white/72">
                {row.comparable}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="rounded-[20px] border border-white/10 bg-black/20 p-5">
            <div className="flex items-center gap-2 text-violet-200/60">
              <SparkIcon className="h-4 w-4" />

              <p className="text-[10px] font-bold uppercase tracking-[0.16em]">
                AI Interpretation
              </p>
            </div>

            <p className="mt-3 text-sm leading-7 text-white/52">
              This comparable ranks highly because its
              physical profile and location closely match
              the subject property. Use it as a market
              reference rather than as a complete substitute
              for a full valuation or inspection.
            </p>
          </div>

          <div className="rounded-[20px] border border-cyan-300/15 bg-cyan-300/[0.06] p-5">
            <div className="flex items-center gap-2 text-cyan-200/60">
              <GaugeIcon className="h-4 w-4" />

              <p className="text-[10px] font-bold uppercase tracking-[0.16em]">
                Similarity
              </p>
            </div>

            <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-cyan-300 shadow-[0_0_24px_rgba(103,232,249,0.45)]"
                style={{
                  width: `${similarity}%`,
                }}
              />
            </div>

            <p className="mt-3 text-2xl font-black text-cyan-100">
              {similarity}%
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
