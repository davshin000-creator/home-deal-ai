type PriceValueComparisonProps = {
  listingPrice?: number | null;
  fairValue?: number | null;
  className?: string;
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

function percent(value: number) {
  return `${value.toFixed(1)}%`;
}

export default function PriceValueComparison({
  listingPrice,
  fairValue,
  className = "",
}: PriceValueComparisonProps) {
  const listing = Math.max(
    0,
    Number(listingPrice ?? 0),
  );

  const fair = Math.max(
    0,
    Number(fairValue ?? 0),
  );

  const maximumValue = Math.max(
    listing,
    fair,
    1,
  );

  const listingWidth = Math.max(
    4,
    Math.min(
      100,
      (listing / maximumValue) * 100,
    ),
  );

  const fairWidth = Math.max(
    4,
    Math.min(
      100,
      (fair / maximumValue) * 100,
    ),
  );

  const valueGap = fair - listing;

  const gapPercent =
    listing > 0
      ? (valueGap / listing) * 100
      : 0;

  const isUndervalued = valueGap >= 0;

  return (
    <article
      className={[
        "relative min-w-0 overflow-hidden",
        "rounded-[30px] border border-white/10",
        "bg-[linear-gradient(145deg,rgba(255,255,255,0.06),rgba(255,255,255,0.025))]",
        "p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)]",
        "md:p-7",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-cyan-300/[0.08] blur-3xl" />

      <div className="relative">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200/60">
              Price Intelligence
            </p>

            <h3 className="mt-3 break-words text-3xl font-black tracking-[-0.05em] [overflow-wrap:anywhere]">
              Listed price vs estimated fair value.
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/38">
              A direct comparison between the current listing and Nestrova&apos;s estimated fair value.
            </p>
          </div>

          <div
            className={[
              "shrink-0 rounded-[18px] border px-4 py-3 text-right",
              isUndervalued
                ? "border-emerald-300/20 bg-emerald-300/10"
                : "border-amber-300/20 bg-amber-300/10",
            ].join(" ")}
          >
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/35">
              Value Gap
            </p>

            <p
              className={[
                "mt-1 text-2xl font-black tracking-[-0.04em]",
                isUndervalued
                  ? "text-emerald-200"
                  : "text-amber-100",
              ].join(" ")}
            >
              {valueGap >= 0 ? "+" : ""}
              {money(valueGap)}
            </p>

            <p className="mt-1 text-xs font-semibold text-white/38">
              {gapPercent >= 0 ? "+" : ""}
              {percent(gapPercent)}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <div className="flex min-w-0 items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/30">
                  Listed Price
                </p>

                <p className="mt-2 truncate text-2xl font-black text-white">
                  {money(listing)}
                </p>
              </div>

              <span className="shrink-0 text-xs font-semibold text-white/28">
                Current ask
              </span>
            </div>

            <div className="mt-3 h-4 overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className="h-full rounded-full bg-white/55 transition-[width] duration-1000 ease-out"
                style={{
                  width: `${listingWidth}%`,
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex min-w-0 items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200/55">
                  Estimated Fair Value
                </p>

                <p className="mt-2 truncate text-2xl font-black text-cyan-100">
                  {money(fair)}
                </p>
              </div>

              <span className="shrink-0 text-xs font-semibold text-cyan-200/40">
                Nestrova estimate
              </span>
            </div>

            <div className="mt-3 h-4 overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className="h-full rounded-full bg-cyan-300 shadow-[0_0_28px_rgba(103,232,249,0.45)] transition-[width] duration-1000 ease-out"
                style={{
                  width: `${fairWidth}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
              Position
            </p>

            <p
              className={[
                "mt-2 text-sm font-bold",
                isUndervalued
                  ? "text-emerald-200"
                  : "text-amber-100",
              ].join(" ")}
            >
              {isUndervalued
                ? "Below Estimated Fair Value"
                : "Above Estimated Fair Value"}
            </p>
          </div>

          <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
              Difference
            </p>

            <p className="mt-2 text-sm font-bold text-white/75">
              {money(Math.abs(valueGap))}
            </p>
          </div>

          <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
            <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
              Relative Gap
            </p>

            <p className="mt-2 text-sm font-bold text-white/75">
              {percent(Math.abs(gapPercent))}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
