"use client";

import { useEffect, useState } from "react";

import {
  BrainIcon,
  DollarIcon,
  GaugeIcon,
  LocationIcon,
  PropertyIcon,
  RentIcon,
  ShieldIcon,
  SparkIcon,
} from "@/components/ui/NestrovaIcons";

import {
  StatusChip,
} from "@/components/ui/nestrova";

type PropertyHeroCardProps = {
  address: string;
  city?: string | null;
  state?: string | null;

  imageUrl?: string | null;

  recommendation?: string | null;
  score?: number | null;

  listingPrice?: number | null;
  fairValue?: number | null;
  monthlyRent?: number | null;
  cashFlow?: number | null;
  discountPercent?: number | null;

  confidence?: number | null;
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

function clampScore(value?: number | null) {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(100, Math.round(value)),
  );
}

function resolveImageUrl(value?: string | null) {
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

function recommendationTone(
  recommendation?: string | null,
): "emerald" | "amber" | "red" | "violet" {
  const normalized = String(
    recommendation ?? "",
  ).toUpperCase();

  if (
    normalized.includes("BUY") ||
    normalized.includes("UNDERVALUED") ||
    normalized.includes("STRONG")
  ) {
    return "emerald";
  }

  if (
    normalized.includes("PASS") ||
    normalized.includes("OVERPRICED") ||
    normalized.includes("AVOID")
  ) {
    return "red";
  }

  if (
    normalized.includes("NEGOTIATE") ||
    normalized.includes("CAUTION")
  ) {
    return "amber";
  }

  return "violet";
}

export default function PropertyHeroCard({
  address,
  city,
  state,
  imageUrl,
  recommendation,
  score,
  listingPrice,
  fairValue,
  monthlyRent,
  cashFlow,
  discountPercent,
  confidence,
}: PropertyHeroCardProps) {
  const [imageFailed, setImageFailed] =
    useState(false);

  const resolvedImageUrl =
    resolveImageUrl(imageUrl);

  useEffect(() => {
    setImageFailed(false);
  }, [resolvedImageUrl]);

  const showImage =
    Boolean(resolvedImageUrl) && !imageFailed;

  const location =
    [city, state].filter(Boolean).join(", ") ||
    "Location intelligence available";

  const normalizedScore = clampScore(score);
  const normalizedConfidence =
    clampScore(confidence);

  const valueDifference =
    Number(fairValue ?? 0) -
    Number(listingPrice ?? 0);

  return (
    <article className="group relative min-w-0 overflow-hidden rounded-[34px] border border-white/10 bg-[#080b0d] shadow-[0_40px_130px_rgba(0,0,0,0.42)]">
      <div className="relative min-h-[520px] overflow-hidden">
        {showImage ? (
          <>
            <img
              src={resolvedImageUrl ?? undefined}
              alt={
                address
                  ? `Property at ${address}`
                  : "Analyzed property"
              }
              onError={() => setImageFailed(true)}
              className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-[1.035]"
            />

            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.72)_42%,rgba(0,0,0,0.20)_75%,rgba(0,0,0,0.06)_100%)]" />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/15" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[linear-gradient(135deg,#07130f_0%,#0c2530_46%,#261637_100%)]" />

            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:54px_54px] opacity-30" />

            <div className="absolute -right-24 -top-28 h-[420px] w-[420px] rounded-full bg-emerald-300/15 blur-3xl" />

            <div className="absolute bottom-[-180px] right-[20%] h-[430px] w-[430px] rounded-full bg-violet-400/15 blur-3xl" />

            <div className="absolute right-[8%] top-1/2 hidden -translate-y-1/2 lg:block">
              <div className="relative h-64 w-96 rounded-[22px] border border-white/15 bg-white/[0.075] shadow-[0_35px_110px_rgba(0,0,0,0.45)] backdrop-blur-sm transition duration-700 group-hover:-translate-y-2">
                <div className="absolute -left-9 -right-9 -top-24 h-32 bg-emerald-100/[0.13] [clip-path:polygon(50%_0%,100%_100%,0%_100%)]" />

                <div className="absolute bottom-0 left-12 h-28 w-16 rounded-t-[8px] border border-white/10 bg-black/30" />

                <div className="absolute right-12 top-12 grid grid-cols-2 gap-5">
                  {Array.from({
                    length: 4,
                  }).map((_, index) => (
                    <span
                      key={index}
                      className="h-12 w-16 rounded-[7px] border border-cyan-100/15 bg-cyan-100/15 shadow-[0_0_24px_rgba(165,243,252,0.08)]"
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="relative z-10 flex min-h-[520px] flex-col justify-between p-6 md:p-9 lg:max-w-[68%]">
          <div className="flex flex-wrap items-center gap-3">
            <StatusChip
              tone={recommendationTone(
                recommendation,
              )}
              icon={
                <ShieldIcon className="h-3.5 w-3.5" />
              }
              className="px-4 py-2 text-[11px]"
            >
              {recommendation || "AI Review"}
            </StatusChip>

            <StatusChip
              tone="cyan"
              icon={
                <BrainIcon className="h-3.5 w-3.5" />
              }
              className="px-4 py-2 text-[11px]"
            >
              {normalizedConfidence}% Confidence
            </StatusChip>

            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-white/45 backdrop-blur-xl">
              <SparkIcon className="h-3.5 w-3.5 text-emerald-200/70" />

              {showImage
                ? "Property Intelligence"
                : "AI Property Visual"}
            </span>
          </div>

          <div className="mt-16 min-w-0">
            <div className="flex items-center gap-2 text-emerald-200/65">
              <LocationIcon className="h-4 w-4 shrink-0" />

              <p className="truncate text-xs font-bold uppercase tracking-[0.17em]">
                {location}
              </p>
            </div>

            <h2 className="mt-4 max-w-full break-words text-[clamp(2.4rem,6vw,5.25rem)] font-black leading-[0.92] tracking-[-0.07em] [overflow-wrap:anywhere]">
              {address || "Analyzed Property"}
            </h2>

            <div className="mt-7 flex flex-wrap items-end gap-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-white/35">
                  Deal Score
                </p>

                <div className="mt-2 flex items-end gap-2">
                  <p className="text-6xl font-black leading-none tracking-[-0.07em] text-emerald-200">
                    {normalizedScore || "—"}
                  </p>

                  <span className="pb-1 text-sm font-semibold text-white/30">
                    /100
                  </span>
                </div>
              </div>

              <div className="min-w-[180px] flex-1">
                <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-emerald-300 shadow-[0_0_24px_rgba(110,231,183,0.48)]"
                    style={{
                      width: `${normalizedScore}%`,
                    }}
                  />
                </div>

                <p className="mt-2 text-xs text-white/35">
                  Overall AI investment opportunity
                </p>
              </div>
            </div>

            <div className="mt-8 grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="min-w-0 rounded-[20px] border border-white/10 bg-black/35 p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-white/30">
                  <DollarIcon className="h-4 w-4" />

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em]">
                    Listed Price
                  </p>
                </div>

                <p className="mt-2 truncate text-xl font-black text-white">
                  {money(listingPrice)}
                </p>
              </div>

              <div className="min-w-0 rounded-[20px] border border-cyan-300/15 bg-cyan-300/[0.08] p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-cyan-200/55">
                  <BrainIcon className="h-4 w-4" />

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em]">
                    Estimated Fair Value
                  </p>
                </div>

                <p className="mt-2 truncate text-xl font-black text-cyan-100">
                  {money(fairValue)}
                </p>
              </div>

              <div className="min-w-0 rounded-[20px] border border-amber-300/15 bg-amber-300/[0.07] p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-amber-100/55">
                  <RentIcon className="h-4 w-4" />

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em]">
                    Monthly Rent
                  </p>
                </div>

                <p className="mt-2 truncate text-xl font-black text-amber-100">
                  {money(monthlyRent)}
                </p>
              </div>

              <div className="min-w-0 rounded-[20px] border border-violet-300/15 bg-violet-300/[0.07] p-4 backdrop-blur-xl">
                <div className="flex items-center gap-2 text-violet-200/55">
                  <GaugeIcon className="h-4 w-4" />

                  <p className="text-[9px] font-bold uppercase tracking-[0.14em]">
                    Monthly Cash Flow
                  </p>
                </div>

                <p className="mt-2 truncate text-xl font-black text-violet-100">
                  {money(cashFlow)}
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <span
                className={[
                  "rounded-full border px-4 py-2",
                  "text-xs font-bold",
                  Number(discountPercent ?? 0) >= 0
                    ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200"
                    : "border-red-300/20 bg-red-300/10 text-red-200",
                ].join(" ")}
              >
                {Number(
                  discountPercent ?? 0,
                ).toFixed(1)}
                % Discount / Premium
              </span>

              <span
                className={[
                  "rounded-full border px-4 py-2",
                  "text-xs font-bold",
                  valueDifference >= 0
                    ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                    : "border-amber-300/20 bg-amber-300/10 text-amber-100",
                ].join(" ")}
              >
                {valueDifference >= 0 ? "+" : ""}
                {money(valueDifference)} Value Gap
              </span>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-5 right-5 hidden items-center gap-2 rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.14em] text-white/35 backdrop-blur-xl md:flex">
          <PropertyIcon className="h-4 w-4 text-emerald-200/55" />
          Nestrova Property Intelligence
        </div>
      </div>
    </article>
  );
}
