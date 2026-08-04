"use client";

import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

type Props = {
  market?: any;
  council?: any;
  opportunities?: any;
  system?: any;
};

type BriefingSlide = {
  eyebrow: string;
  title: string;
  description: string;
  primaryLabel: string;
  primaryValue: string;
  secondaryLabel: string;
  secondaryValue: string;
  confidence: number;
  tone: "cyan" | "emerald" | "amber" | "violet";
};

const TONE_CLASSES = {
  cyan: {
    badge:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
    glow: "bg-cyan-400/15",
    bar: "bg-cyan-300",
    value: "text-cyan-200",
  },
  emerald: {
    badge:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    glow: "bg-emerald-400/15",
    bar: "bg-emerald-300",
    value: "text-emerald-200",
  },
  amber: {
    badge:
      "border-amber-300/20 bg-amber-300/10 text-amber-200",
    glow: "bg-amber-300/15",
    bar: "bg-amber-200",
    value: "text-amber-200",
  },
  violet: {
    badge:
      "border-violet-400/20 bg-violet-400/10 text-violet-200",
    glow: "bg-violet-400/15",
    bar: "bg-violet-300",
    value: "text-violet-200",
  },
} as const;

function clampConfidence(value: unknown, fallback: number) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.min(100, Math.max(0, Math.round(parsed)));
}

function getText(
  value: unknown,
  fallback: string,
): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim();

  return normalized || fallback;
}

function getOpportunitySymbol(
  opportunities: any,
): string {
  if (Array.isArray(opportunities)) {
    const first = opportunities[0];

    return getText(
      first?.symbol ??
        first?.ticker ??
        first?.asset,
      "NVDA",
    );
  }

  if (
    Array.isArray(opportunities?.items) &&
    opportunities.items.length > 0
  ) {
    const first = opportunities.items[0];

    return getText(
      first?.symbol ??
        first?.ticker ??
        first?.asset,
      "NVDA",
    );
  }

  return getText(
    opportunities?.top_opportunity?.symbol ??
      opportunities?.symbol,
    "NVDA",
  );
}

function getOpportunityScore(
  opportunities: any,
): number {
  if (Array.isArray(opportunities)) {
    return clampConfidence(
      opportunities[0]?.score ??
        opportunities[0]?.confidence,
      91,
    );
  }

  if (
    Array.isArray(opportunities?.items) &&
    opportunities.items.length > 0
  ) {
    return clampConfidence(
      opportunities.items[0]?.score ??
        opportunities.items[0]?.confidence,
      91,
    );
  }

  return clampConfidence(
    opportunities?.top_opportunity?.score ??
      opportunities?.score ??
      opportunities?.confidence,
    91,
  );
}

function getCouncilAgreement(council: any): number {
  return clampConfidence(
    council?.agreement ??
      council?.agreement_percent ??
      council?.confidence ??
      council?.consensus_score,
    88,
  );
}

function getMarketConfidence(market: any): number {
  return clampConfidence(
    market?.confidence ??
      market?.market_confidence ??
      market?.weighted_confidence,
    84,
  );
}

function getMarketRegime(market: any): string {
  return getText(
    market?.regime ??
      market?.market_regime ??
      market?.trend ??
      market?.state,
    "Bullish",
  );
}

function getSystemStatus(system: any): string {
  return getText(
    system?.status ??
      system?.system_status ??
      system?.health,
    "Operational",
  );
}

export default function TradingAI({
  market,
  council,
  opportunities,
  system,
}: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = useMemo<BriefingSlide[]>(() => {
    const marketConfidence =
      getMarketConfidence(market);

    const marketRegime =
      getMarketRegime(market);

    const opportunitySymbol =
      getOpportunitySymbol(opportunities);

    const opportunityScore =
      getOpportunityScore(opportunities);

    const councilAgreement =
      getCouncilAgreement(council);

    const councilDecision = getText(
      council?.decision ??
        council?.consensus ??
        council?.recommendation,
      "Bullish",
    );

    const systemStatus =
      getSystemStatus(system);

    const systemConfidence = clampConfidence(
      system?.confidence ??
        system?.health_score,
      96,
    );

    return [
      {
        eyebrow: "Today's AI Briefing",
        title: "Market conditions remain constructive.",
        description:
          "Momentum, participation, and broader market structure continue to support selective opportunity discovery.",
        primaryLabel: "Market Regime",
        primaryValue: marketRegime,
        secondaryLabel: "Risk Level",
        secondaryValue: getText(
          market?.risk ??
            market?.risk_level,
          "Low",
        ),
        confidence: marketConfidence,
        tone: "cyan",
      },
      {
        eyebrow: "Top Opportunity",
        title: `${opportunitySymbol} leads the current ranking.`,
        description:
          "Nestrova identified this asset as the strongest current opportunity based on momentum, market regime, and confidence.",
        primaryLabel: "Asset",
        primaryValue: opportunitySymbol,
        secondaryLabel: "Signal",
        secondaryValue: getText(
          opportunities?.signal ??
            opportunities?.top_opportunity?.signal,
          "Watch",
        ),
        confidence: opportunityScore,
        tone: "emerald",
      },
      {
        eyebrow: "Executive Council",
        title: "AI models are reaching a strong consensus.",
        description:
          "The Executive Council combines multiple analytical models to reduce single-model bias and improve decision clarity.",
        primaryLabel: "Council Decision",
        primaryValue: councilDecision,
        secondaryLabel: "Agreement",
        secondaryValue: `${councilAgreement}%`,
        confidence: councilAgreement,
        tone: "violet",
      },
      {
        eyebrow: "System Intelligence",
        title: "Nestrova systems are actively monitoring markets.",
        description:
          "Market data, opportunity scoring, risk analysis, and portfolio intelligence are operating as a unified research system.",
        primaryLabel: "System Status",
        primaryValue: systemStatus,
        secondaryLabel: "Monitoring",
        secondaryValue: "Active",
        confidence: systemConfidence,
        tone: "amber",
      },
    ];
  }, [council, market, opportunities, system]);

  useEffect(() => {
    if (isPaused || slides.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) =>
        (currentIndex + 1) % slides.length,
      );
    }, 5500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isPaused, slides.length]);

  const activeSlide =
    slides[activeIndex] ?? slides[0];

  const tone =
    TONE_CLASSES[activeSlide.tone];

  function goToPreviousSlide() {
    setActiveIndex((currentIndex) =>
      currentIndex === 0
        ? slides.length - 1
        : currentIndex - 1,
    );
  }

  function goToNextSlide() {
    setActiveIndex((currentIndex) =>
      (currentIndex + 1) % slides.length,
    );
  }

  return (
    <section
  className="relative overflow-hidden rounded-[34px] border border-white/10 bg-[#0a0a0a] p-6 text-white shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className={`pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl ${tone.glow}`}
      />

      <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-white/[0.035] blur-3xl" />

      <div className="relative flex flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.07] text-sm font-black">
                N
              </div>

              <div>
                <h2 className="text-lg font-semibold tracking-[-0.025em]">
                  Nestrova AI Briefing
                </h2>

                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.17em] text-white/30">
                  Market intelligence
                </p>
              </div>
            </div>
          </div>

          <span
            className={`rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.14em] ${tone.badge}`}
          >
            Live Insight
          </span>
        </div>

        <div className="mt-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
            {activeSlide.eyebrow}
          </p>

          <h3 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.055em]">
            {activeSlide.title}
          </h3>

          <p className="mt-4 text-sm leading-7 text-white/44">
            {activeSlide.description}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/28">
              {activeSlide.primaryLabel}
            </p>

            <p
              className={`mt-3 text-2xl font-semibold tracking-[-0.04em] ${tone.value}`}
            >
              {activeSlide.primaryValue}
            </p>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-white/[0.045] p-5">
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/28">
              {activeSlide.secondaryLabel}
            </p>

            <p className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white/80">
              {activeSlide.secondaryValue}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-[26px] border border-white/10 bg-black/30 p-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/28">
                AI Confidence
              </p>

              <p className="mt-2 text-sm text-white/42">
                Confidence across current signals
              </p>
            </div>

            <p className="text-3xl font-semibold tracking-[-0.05em]">
              {activeSlide.confidence}
              <span className="ml-1 text-base text-white/35">
                %
              </span>
            </p>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full rounded-full transition-[width] duration-700 ${tone.bar}`}
              style={{
                width: `${activeSlide.confidence}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              {slides.map((slide, index) => (
                <button
                  key={`${slide.eyebrow}-${index}`}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`View briefing slide ${index + 1}`}
                  className={
                    index === activeIndex
                      ? "h-2.5 w-7 rounded-full bg-white transition-all"
                      : "h-2.5 w-2.5 rounded-full bg-white/20 transition-all hover:bg-white/40"
                  }
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goToPreviousSlide}
                aria-label="Previous briefing slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-lg text-white/45 transition hover:bg-white/10 hover:text-white"
              >
                ‹
              </button>

              <button
                type="button"
                onClick={goToNextSlide}
                aria-label="Next briefing slide"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-lg text-white/45 transition hover:bg-white/10 hover:text-white"
              >
                ›
              </button>
            </div>
          </div>

          <Link
            href="/trading/briefing"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-white px-6 py-4 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
          >
            View Full Briefing →
          </Link>

          <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.14em] text-white/25">
            <span>
              Auto-updates every 5.5 seconds
            </span>

            <span>
              {isPaused ? "Paused" : "Live"}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}