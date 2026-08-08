import {
  GaugeIcon,
  LocationIcon,
  PropertyIcon,
  SparkIcon,
} from "@/components/ui/NestrovaIcons";

type ComparableProperty = {
  id?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  property_type?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  square_footage?: number | null;
  year_built?: number | null;
  status?: string | null;
  price?: number | null;
  days_on_market?: number | null;
  distance_miles?: number | null;
  rentcast_correlation?: number | null;
  similarity_score?: number | null;
};

type ComparablePropertiesProps = {
  comparables?: ComparableProperty[] | null;
};

function money(value?: number | null) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return `$${Math.round(value).toLocaleString(
    "en-US",
  )}`;
}

function numberOrDash(
  value?: number | null,
) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return "—";
  }

  return value.toLocaleString("en-US");
}

export default function ComparableProperties({
  comparables,
}: ComparablePropertiesProps) {
  const ranked = [...(comparables ?? [])]
    .filter((item) => item.address)
    .sort(
      (a, b) =>
        Number(b.similarity_score ?? 0) -
        Number(a.similarity_score ?? 0),
    )
    .slice(0, 5);

  if (ranked.length === 0) {
    return null;
  }

  const best = ranked[0];
  const others = ranked.slice(1);

  return (
    <section className="min-w-0">
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] border border-emerald-300/20 bg-emerald-300/10 text-emerald-200">
              <PropertyIcon className="h-5 w-5" />
            </span>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200/65">
                Comparable Intelligence
              </p>

              <p className="mt-1 text-xs text-white/30">
                Ranked using RentCast similarity and Nestrova weighting
              </p>
            </div>
          </div>

          <h2 className="mt-5 break-words text-3xl font-black tracking-[-0.05em] [overflow-wrap:anywhere]">
            Closest comparable properties.
          </h2>
        </div>

        <span className="shrink-0 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white/40">
          {ranked.length} matches
        </span>
      </div>

      <div className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <article className="relative min-w-0 overflow-hidden rounded-[32px] border border-emerald-300/20 bg-[linear-gradient(145deg,rgba(52,211,153,0.10),rgba(255,255,255,0.035))] p-6 shadow-[0_30px_90px_rgba(0,0,0,0.28)]">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-300/[0.08] blur-3xl" />

          <div className="relative">
            <div className="flex min-w-0 items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-200">
                  <SparkIcon className="h-3.5 w-3.5" />
                  Best Match
                </div>

                <h3 className="mt-5 break-words text-3xl font-black tracking-[-0.055em] [overflow-wrap:anywhere]">
                  {best.address}
                </h3>

                <div className="mt-3 flex min-w-0 items-center gap-2 text-sm text-white/38">
                  <LocationIcon className="h-4 w-4 shrink-0 text-emerald-200/55" />

                  <span className="min-w-0 truncate">
                    {[best.city, best.state]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </div>
              </div>

              <div className="shrink-0 rounded-[18px] border border-emerald-300/20 bg-emerald-300/10 px-4 py-3 text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-200/50">
                  Similarity
                </p>

                <p className="mt-1 text-3xl font-black text-emerald-100">
                  {Math.round(
                    Number(
                      best.similarity_score ?? 0,
                    ),
                  )}
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [
                  "Price",
                  money(best.price),
                ],
                [
                  "Beds / Baths",
                  `${best.bedrooms ?? "—"} / ${
                    best.bathrooms ?? "—"
                  }`,
                ],
                [
                  "Square Feet",
                  numberOrDash(
                    best.square_footage,
                  ),
                ],
                [
                  "Year Built",
                  String(
                    best.year_built ?? "—",
                  ),
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="min-w-0 rounded-[18px] border border-white/10 bg-black/20 p-4"
                >
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                    {label}
                  </p>

                  <p className="mt-2 truncate text-sm font-bold text-white/78">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                  Distance
                </p>

                <p className="mt-2 text-sm font-bold text-white/72">
                  {Number(
                    best.distance_miles ?? 0,
                  ).toFixed(2)}
                  {" "}mi
                </p>
              </div>

              <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                  Market Status
                </p>

                <p className="mt-2 truncate text-sm font-bold text-white/72">
                  {best.status || "Unknown"}
                </p>
              </div>

              <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                  Days on Market
                </p>

                <p className="mt-2 text-sm font-bold text-white/72">
                  {best.days_on_market ?? "—"}
                </p>
              </div>
            </div>
          </div>
        </article>

        <article className="min-w-0 rounded-[32px] border border-white/10 bg-white/[0.045] p-6">
          <div className="flex items-center gap-2 text-white/42">
            <GaugeIcon className="h-4 w-4" />

            <p className="text-[10px] font-bold uppercase tracking-[0.17em]">
              Why this match ranks first
            </p>
          </div>

          <div className="mt-5 space-y-3">
            {[
              `${Math.round(
                Number(
                  best.rentcast_correlation ??
                    0,
                ) * 100,
              )}% RentCast correlation`,
              `${best.bedrooms ?? "—"} bed / ${
                best.bathrooms ?? "—"
              } bath configuration`,
              `${numberOrDash(
                best.square_footage,
              )} sqft living area`,
              `${Number(
                best.distance_miles ?? 0,
              ).toFixed(2)} miles from subject property`,
              best.year_built
                ? `Built in ${best.year_built}`
                : "Construction year unavailable",
            ].map((reason) => (
              <div
                key={reason}
                className="flex min-w-0 gap-3 rounded-[18px] border border-white/10 bg-black/20 p-4 text-sm leading-6 text-white/55"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-300" />

                <span className="min-w-0 break-words [overflow-wrap:anywhere]">
                  {reason}
                </span>
              </div>
            ))}
          </div>
        </article>
      </div>

      {others.length > 0 ? (
        <div className="mt-6 grid auto-rows-fr gap-4 md:grid-cols-2 xl:grid-cols-4">
          {others.map((property) => (
            <article
              key={
                property.id ??
                property.address
              }
              className="group flex min-w-0 flex-col rounded-[24px] border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/20 hover:bg-emerald-300/[0.045]"
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                    Comparable
                  </p>

                  <h3 className="mt-2 break-words text-lg font-black tracking-[-0.035em] [overflow-wrap:anywhere]">
                    {property.address}
                  </h3>
                </div>

                <span className="shrink-0 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1.5 text-xs font-black text-cyan-100">
                  {Math.round(
                    Number(
                      property.similarity_score ??
                        0,
                    ),
                  )}
                </span>
              </div>

              <p className="mt-4 text-2xl font-black text-white">
                {money(property.price)}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2 text-xs text-white/42">
                <span>
                  {property.bedrooms ?? "—"} bd
                </span>
                <span>
                  {property.bathrooms ?? "—"} ba
                </span>
                <span>
                  {numberOrDash(
                    property.square_footage,
                  )}{" "}
                  sqft
                </span>
                <span>
                  {property.year_built ?? "—"}
                </span>
              </div>

              <div className="mt-auto pt-5 text-xs text-white/30">
                {Number(
                  property.distance_miles ?? 0,
                ).toFixed(2)}{" "}
                mi away
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}
