"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useUser } from "@/components/auth/ClerkCompat";
import UserAwareNestrovaShell from "@/components/shell/UserAwareNestrovaShell";
import RealEstateQuickAnalyze from "@/components/real-estate/RealEstateQuickAnalyze";
import {
  ArrowRightIcon,
  BrainIcon,
  DollarIcon,
  GaugeIcon,
  LocationIcon,
  PropertyIcon,
  RentIcon,
  SearchPropertyIcon,
  ShieldIcon,
  SparkIcon,
} from "@/components/ui/NestrovaIcons";
import {
  GlassPanel,
  MetricTile,
  StatusChip,
} from "@/components/ui/nestrova";

type SavedProperty = {
  id: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  listing_price?: number | null;
  fair_value?: number | null;
  estimated_rent?: number | null;
  brain_score?: number | null;
  recommendation?: string | null;
  summary?: string | null;
  image_url?: string | null;
  created_at?: string | null;
};

type SavedPropertiesResponse = {
  properties?: SavedProperty[];
  error?: string;
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

function averageScore(properties: SavedProperty[]) {
  const scores = properties
    .map((property) => property.brain_score)
    .filter(
      (score): score is number =>
        typeof score === "number" &&
        Number.isFinite(score),
    );

  if (scores.length === 0) {
    return 0;
  }

  return Math.round(
    scores.reduce((sum, score) => sum + score, 0) /
      scores.length,
  );
}

function recommendationTone(
  value?: string | null,
): "emerald" | "amber" | "red" {
  const normalized = String(value ?? "")
    .trim()
    .toUpperCase();

  if (
    normalized.includes("BUY") ||
    normalized.includes("UNDERVALUED") ||
    normalized.includes("STRONG")
  ) {
    return "emerald";
  }

  if (
    normalized.includes("PASS") ||
    normalized.includes("OVERVALUED") ||
    normalized.includes("AVOID")
  ) {
    return "red";
  }

  return "amber";
}


function resolvePropertyImageUrl(
  value?: string | null,
) {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    return null;
  }

  try {
    const parsed = new URL(normalized);

    if (
      parsed.protocol !== "https:" &&
      parsed.protocol !== "http:"
    ) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

function PropertyVisual({
  property,
}: {
  property: SavedProperty;
}) {
  const [imageFailed, setImageFailed] =
    useState(false);

  const location =
    [property.city, property.state]
      .filter(Boolean)
      .join(", ") ||
    property.address?.trim() ||
    "Property Intelligence";

  const score = Math.max(
    0,
    Math.min(
      100,
      Math.round(property.brain_score ?? 0),
    ),
  );

  const imageUrl = resolvePropertyImageUrl(
    property.image_url,
  );

  const showPropertyImage =
    Boolean(imageUrl) && !imageFailed;

  return (
    <div className="group/visual relative h-52 overflow-hidden rounded-[24px] border border-white/10 bg-[linear-gradient(145deg,#14382d_0%,#142236_48%,#241637_100%)]">
      {showPropertyImage ? (
        <>
          <img
            src={imageUrl ?? undefined}
            alt={
              property.address
                ? `Property at ${property.address}`
                : "Saved property"
            }
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover/visual:scale-[1.045]"
          />

          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.12)_42%,rgba(0,0,0,0.88))]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.055)_1px,transparent_1px)] bg-[size:34px_34px] opacity-25" />

          <div className="absolute -right-12 -top-16 h-44 w-44 rounded-full bg-emerald-300/15 blur-3xl" />

          <div className="absolute left-1/2 top-[46%] h-24 w-40 -translate-x-1/2 -translate-y-1/2 rounded-[8px] border border-white/15 bg-white/[0.07] shadow-[0_24px_70px_rgba(0,0,0,0.28)] transition duration-500 group-hover/visual:-translate-y-[54%]">
            <div className="absolute -left-4 -right-4 -top-10 h-14 bg-emerald-100/[0.14] [clip-path:polygon(50%_0%,100%_100%,0%_100%)]" />

            <div className="absolute bottom-0 left-5 h-14 w-9 rounded-t-[5px] border border-white/10 bg-black/25" />

            <div className="absolute right-5 top-5 grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map(
                (_, index) => (
                  <span
                    key={index}
                    className="h-5 w-6 rounded-[3px] border border-cyan-100/15 bg-cyan-100/15"
                  />
                ),
              )}
            </div>
          </div>
        </>
      )}

      <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-2 backdrop-blur-xl">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/45">
          {showPropertyImage
            ? "Property Photo"
            : "AI Property Visual"}
        </p>
      </div>

      <div className="absolute right-4 top-4 rounded-[15px] border border-white/10 bg-black/45 px-3 py-2 text-right backdrop-blur-xl">
        <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/40">
          Deal Score
        </p>

        <p className="mt-1 text-lg font-black text-emerald-200">
          {score || "—"}
        </p>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-5 pt-14">
        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-200/65">
          Property Intelligence
        </p>

        <p className="mt-2 truncate text-lg font-bold text-white">
          {location}
        </p>
      </div>
    </div>
  );
}

export default function RealEstateDashboardPage() {
  const { isLoaded, isSignedIn } = useUser();

  const [properties, setProperties] =
    useState<SavedProperty[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    void loadProperties();
  }, [isLoaded, isSignedIn]);

  async function loadProperties() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "/api/saved-properties",
        {
          method: "GET",
          cache: "no-store",
          headers: {
            Accept: "application/json",
          },
        },
      );

      const data =
        (await response.json()) as SavedPropertiesResponse;

      if (!response.ok) {
        throw new Error(
          data.error ??
            "Unable to load saved properties.",
        );
      }

      setProperties(
        Array.isArray(data.properties)
          ? data.properties
          : [],
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Property dashboard is unavailable.",
      );
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }

  const rankedProperties = useMemo(
    () =>
      [...properties].sort(
        (first, second) =>
          (second.brain_score ?? 0) -
          (first.brain_score ?? 0),
      ),
    [properties],
  );

  const bestProperty =
    rankedProperties[0] ?? null;

  const totalValue = properties.reduce(
    (sum, property) =>
      sum + (property.fair_value ?? 0),
    0,
  );

  const totalRent = properties.reduce(
    (sum, property) =>
      sum + (property.estimated_rent ?? 0),
    0,
  );

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#08080b] p-8 text-white">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-64 rounded-[36px] border border-white/10 bg-white/[0.04]" />
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#08080b] px-5 text-white">
        <div className="w-full max-w-2xl rounded-[36px] border border-white/10 bg-white/[0.05] p-10 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300/70">
            Real Estate Intelligence
          </p>

          <h1 className="mt-5 text-4xl font-black tracking-[-0.05em]">
            Sign in to view your property dashboard.
          </h1>

          <p className="mt-4 text-white/45">
            Analyze properties, save opportunities, and review your AI property portfolio.
          </p>

          <Link
            href="/analyze"
            className="mt-7 inline-flex rounded-[14px] bg-white px-6 py-3 text-sm font-bold text-black"
          >
            Start Property Analysis
          </Link>
        </div>
      </main>
    );
  }

  return (
    <UserAwareNestrovaShell
      title="Real Estate"
      subtitle="Understand properties with clear AI research."
    >
      <div className="mx-auto w-full max-w-[1580px] px-5 py-8 md:px-8 md:py-10">
        <section className="rounded-[36px] border border-white/10 bg-white/[0.045] p-6 md:p-9">
          <div className="max-w-4xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200/65">
              Real Estate
            </p>

            <h1 className="mt-4 text-[clamp(2.5rem,7vw,5.5rem)] font-black leading-[0.94] tracking-[-0.065em]">
              Understand any property
              <span className="block text-white/35">
                before you make a decision.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 md:text-base">
              Enter an address to explore estimated value,
              rental potential, Deal Score, risks, and
              negotiation context in one place.
            </p>

            <RealEstateQuickAnalyze />
          </div>

          <div className="mt-8 grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold">
                Property Value
              </p>
              <p className="mt-1 text-xs leading-5 text-white/30">
                Compare listing price with estimated fair value.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold">
                Rental Potential
              </p>
              <p className="mt-1 text-xs leading-5 text-white/30">
                Understand rent estimates and investment yield.
              </p>
            </div>

            <div>
              <p className="text-sm font-semibold">
                Deal Quality
              </p>
              <p className="mt-1 text-xs leading-5 text-white/30">
                See opportunity, risk, and negotiation context.
              </p>
            </div>
          </div>
        </section>

        {error ? (
          <section className="mt-6 rounded-[26px] border border-red-400/20 bg-red-400/[0.08] p-5">
            <p className="font-semibold text-red-200">
              Property data could not be loaded.
            </p>

            <p className="mt-2 text-sm text-red-100/55">
              {error}
            </p>

            <button
              type="button"
              onClick={() => void loadProperties()}
              className="mt-4 rounded-[12px] border border-white/10 bg-white/[0.06] px-4 py-2 text-sm"
            >
              Try again
            </button>
          </section>
        ) : null}

        {loading ? (
          <section className="mt-6 grid animate-pulse gap-6 xl:grid-cols-2">
            <div className="h-96 rounded-[32px] border border-white/10 bg-white/[0.04]" />
            <div className="h-96 rounded-[32px] border border-white/10 bg-white/[0.04]" />
          </section>
        ) : properties.length === 0 ? (
          <section className="mt-6 rounded-[32px] border border-white/10 bg-white/[0.04] p-9 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300/70">
              Property Portfolio
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">
              Analyze and save your first property.
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/40">
              Your saved properties, Deal Scores, fair values, and rent estimates will appear here.
            </p>

            <Link
              href="/analyze"
              className="mt-6 inline-flex rounded-[14px] bg-emerald-300 px-5 py-3 text-sm font-bold text-black"
            >
              Start Analysis
            </Link>
          </section>
        ) : (
          <>
            {bestProperty ? (
              <>
                <section className="mt-8">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-200/60">
                        Your Best Property
                      </p>

                      <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">
                        Your strongest saved opportunity.
                      </h2>
                    </div>

                    <Link
                      href={`/analyze?address=${encodeURIComponent(
                        bestProperty.address || "",
                      )}&price=${
                        bestProperty.listing_price || ""
                      }`}
                      className="text-sm font-semibold text-emerald-200/70 transition hover:text-emerald-200"
                    >
                      View full analysis →
                    </Link>
                  </div>

                  <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
                    <div className="rounded-[30px] border border-white/10 bg-white/[0.045] p-6">
                      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-2xl font-black tracking-[-0.045em]">
                            {bestProperty.address ||
                              "Saved Property"}
                          </p>

                          <p className="mt-2 text-sm text-white/35">
                            {[bestProperty.city, bestProperty.state]
                              .filter(Boolean)
                              .join(", ") ||
                              "Location unavailable"}
                          </p>
                        </div>

                        <div className="shrink-0 rounded-[20px] border border-emerald-300/15 bg-emerald-300/[0.07] px-5 py-4 text-center">
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-200/55">
                            Deal Score
                          </p>

                          <p className="mt-1 text-4xl font-black text-emerald-200">
                            {bestProperty.brain_score ?? "—"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/25">
                            Fair Value
                          </p>

                          <p className="mt-2 text-xl font-bold">
                            {money(
                              bestProperty.fair_value,
                            )}
                          </p>
                        </div>

                        <div className="rounded-[20px] border border-white/10 bg-black/20 p-4">
                          <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/25">
                            Estimated Rent
                          </p>

                          <p className="mt-2 text-xl font-bold">
                            {money(
                              bestProperty.estimated_rent,
                            )}
                            <span className="ml-1 text-xs font-medium text-white/30">
                              / mo
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <Link
                          href={`/analyze?address=${encodeURIComponent(
                            bestProperty.address || "",
                          )}&price=${
                            bestProperty.listing_price || ""
                          }`}
                          className="inline-flex items-center gap-2 rounded-[14px] bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-neutral-200"
                        >
                          View Analysis
                          <ArrowRightIcon className="h-4 w-4" />
                        </Link>

                        <Link
                          href="/compare"
                          className="inline-flex items-center gap-2 rounded-[14px] border border-white/10 bg-white/[0.05] px-5 py-3 text-sm font-semibold text-white/55 transition hover:bg-white/[0.09] hover:text-white"
                        >
                          Compare
                        </Link>
                      </div>
                    </div>

                    <div className="rounded-[30px] border border-white/10 bg-white/[0.035] p-5">
                      <PropertyVisual
                        property={bestProperty}
                      />
                    </div>
                  </div>
                </section>

                <section className="mt-10">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">
                        Your Properties
                      </p>

                      <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">
                        Recent saved properties.
                      </h2>
                    </div>

                    <Link
                      href="/saved"
                      className="text-sm font-semibold text-emerald-200/70 transition hover:text-emerald-200"
                    >
                      View all →
                    </Link>
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {rankedProperties
                      .slice(0, 3)
                      .map((property) => (
                        <Link
                          key={property.id}
                          href={`/analyze?address=${encodeURIComponent(
                            property.address || "",
                          )}&price=${
                            property.listing_price || ""
                          }`}
                          className="group rounded-[26px] border border-white/10 bg-white/[0.04] p-5 transition hover:-translate-y-1 hover:border-emerald-300/20 hover:bg-white/[0.065]"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="min-w-0">
                              <p className="truncate text-base font-bold">
                                {property.address ||
                                  "Saved Property"}
                              </p>

                              <p className="mt-1 truncate text-xs text-white/30">
                                {[property.city, property.state]
                                  .filter(Boolean)
                                  .join(", ")}
                              </p>
                            </div>

                            <div className="shrink-0 text-right">
                              <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-white/25">
                                Score
                              </p>

                              <p className="mt-1 text-2xl font-black text-emerald-200">
                                {property.brain_score ??
                                  "—"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                            <div>
                              <p className="text-[9px] uppercase tracking-[0.12em] text-white/25">
                                Fair Value
                              </p>

                              <p className="mt-1 text-sm font-semibold">
                                {money(
                                  property.fair_value,
                                )}
                              </p>
                            </div>

                            <span className="text-sm font-semibold text-emerald-200/60 transition group-hover:text-emerald-200">
                              Open →
                            </span>
                          </div>
                        </Link>
                      ))}
                  </div>
                </section>
              </>
            ) : null}
          </>
        )}

        <p className="mt-10 text-xs leading-6 text-white/25">
          Property estimates and AI scores are informational decision-support tools and are not guarantees of market value, rent, financing terms, or investment performance.
        </p>
      </div>
    </UserAwareNestrovaShell>
  );
}
