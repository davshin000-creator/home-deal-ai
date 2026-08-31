"use client";

import Link from "next/link";
import { useEffect } from "react";

export type UpgradeProduct =
  | "real_estate"
  | "trading"
  | "all_access";

type UpgradeGateProps = {
  isOpen: boolean;
  product: UpgradeProduct;
  featureName: string;
  description?: string;
  onClose: () => void;
};

type UpgradeContent = {
  eyebrow: string;
  title: string;
  planName: string;
  price: string;
  pricingHref: string;
  accentClasses: string;
  glowClasses: string;
  benefits: string[];
};

const UPGRADE_CONTENT: Record<
  UpgradeProduct,
  UpgradeContent
> = {
  real_estate: {
    eyebrow: "Real Estate Pro",
    title: "Unlock advanced property intelligence.",
    planName: "Real Estate Pro",
    price: "$9.99/month",
    pricingHref: "/pricing#plans",
    accentClasses:
      "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
    glowClasses: "bg-cyan-400/15",
    benefits: [
      "Unlimited property analyses",
      "AI fair-value estimates",
      "Deal Scores and investment metrics",
      "Rent and yield estimates",
      "Saved property comparisons",
    ],
  },

  trading: {
    eyebrow: "Radar Pro",
    title: "Unlock premium market intelligence.",
    planName: "Radar Pro",
    price: "$9.99/month",
    pricingHref: "/pricing#plans",
    accentClasses:
      "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
    glowClasses: "bg-emerald-400/15",
    benefits: [
      "Unlimited trading watchlists",
      "Custom AI alerts",
      "Full asset intelligence",
      "AI Daily Brief",
      "Portfolio intelligence",
    ],
  },

  all_access: {
    eyebrow: "Nestrova AI Pro",
    title: "Unlock the complete Nestrova platform.",
    planName: "Nestrova AI Pro",
    price: "$17.99/month",
    pricingHref: "/pricing#plans",
    accentClasses:
      "border-amber-300/30 bg-amber-300/10 text-amber-200",
    glowClasses: "bg-amber-300/15",
    benefits: [
      "Everything in Real Estate Pro",
      "Everything in Radar Pro",
      "Eligible future AI products",
      "Early access to new features",
      "Save $2 every month",
    ],
  },
};

export default function UpgradeGate({
  isOpen,
  product,
  featureName,
  description,
  onClose,
}: UpgradeGateProps) {
  const content = UPGRADE_CONTENT[product];

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-5 py-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="upgrade-gate-title"
    >
      <button
        type="button"
        aria-label="Close upgrade window"
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-xl"
      />

      <section className="relative z-10 w-full max-w-[620px] overflow-hidden rounded-[40px] border border-white/10 bg-[#0a0a0a] p-6 shadow-[0_50px_180px_rgba(0,0,0,0.8)] md:p-8">
        <div
          className={`pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl ${content.glowClasses}`}
        />

        <div
          className={`pointer-events-none absolute -bottom-36 -left-24 h-72 w-72 rounded-full blur-3xl ${content.glowClasses}`}
        />

        <div className="relative">
          <div className="flex items-start justify-between gap-5">
            <div>
              <span
                className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] ${content.accentClasses}`}
              >
                {content.eyebrow}
              </span>

              <div className="mt-6 flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/10 bg-white/[0.07] text-2xl">
                &#10022;
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-xl text-white/45 transition hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              &#215;
            </button>
          </div>

          <p className="mt-7 text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
            Premium feature
          </p>

          <h2
            id="upgrade-gate-title"
            className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.05em] md:text-4xl"
          >
            {featureName}
          </h2>

          <p className="mt-4 text-lg font-semibold text-white/72">
            {content.title}
          </p>

          <p className="mt-3 text-sm leading-7 text-white/42">
            {description ??
              `${featureName} is available with ${content.planName}. Upgrade to unlock this feature and continue your Nestrova workflow.`}
          </p>

          <div className="mt-7 rounded-[28px] border border-white/10 bg-black/30 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/28">
                  Recommended plan
                </p>

                <p className="mt-2 text-xl font-semibold">
                  {content.planName}
                </p>
              </div>

              <p className="text-2xl font-semibold tracking-[-0.04em]">
                {content.price}
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              {content.benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex items-start gap-3"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-[10px] font-black text-black">
                    &#10003;
                  </span>

                  <p className="text-sm leading-6 text-white/55">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-white/[0.055] px-6 py-4 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white"
            >
              Not now
            </button>

            <Link
              href={content.pricingHref}
              className="rounded-full bg-white px-6 py-4 text-center text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
            >
              View {content.planName}
            </Link>
          </div>

          {product !== "all_access" && (
            <Link
              href="/pricing#plans"
              className="mt-4 inline-flex w-full justify-center text-xs font-semibold text-amber-200/65 transition hover:text-amber-200"
            >
              Or unlock everything with Nestrova AI Pro &#8594;
            </Link>
          )}

          <p className="mt-5 text-center text-[11px] leading-5 text-white/25">
            Paid plans include a 5-day free trial and renew
            monthly until canceled.
          </p>
        </div>
      </section>
    </div>
  );
}
