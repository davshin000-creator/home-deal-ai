"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import PayPalSubscriptionButton from "@/components/payments/PayPalSubscriptionButton";
import {
  useUser,
  UserButton,
} from "@/components/auth/ClerkCompat";
import SiteFooter from "@/components/site/SiteFooter";
import NestrovaMark from "@/components/brand/NestrovaMark";

type PlanFeature = {
  text: string;
  emphasized?: boolean;
};

type ComparisonValue = string | boolean;

type ComparisonRow = {
  feature: string;
  free: ComparisonValue;
  realEstate: ComparisonValue;
  trading: ComparisonValue;
  allAccess: ComparisonValue;
};

const platformFeatures = [
  {
    label: "Real Estate AI",
    title: "Analyze properties in seconds.",
    description:
      "Estimate fair value, rental potential, investment quality, and deal strength from one workspace.",
    icon: "⌂",
    accent:
      "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
  },
  {
    label: "Radar",
    title: "Find opportunities before they disappear.",
    description:
      "Track opportunity scores, market regimes, watchlists, risk levels, and customized alerts.",
    icon: "↗",
    accent:
      "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  },
  {
    label: "Research Intelligence",
    title: "Investigate signals from multiple AI perspectives.",
    description:
      "Run Deep Research, Research Council, comparisons, saved research, watchlists, history, and change alerts from one evidence-driven workspace.",
    icon: "◎",
    accent:
      "border-violet-400/20 bg-violet-400/10 text-violet-200",
  },
  {
    label: "AI Decision Engine",
    title: "Understand the signal, not just the number.",
    description:
      "Turn complex market and property data into clear explanations designed to support better decisions.",
    icon: "N",
    accent:
      "border-violet-400/20 bg-violet-400/10 text-violet-200",
  },
  {
    label: "Growing Platform",
    title: "One account for future Nestrova products.",
    description:
      "All Access members receive eligible future AI products while their subscription remains active.",
    icon: "+",
    accent:
      "border-amber-400/20 bg-amber-400/10 text-amber-200",
  },
];

const freeFeatures: PlanFeature[] = [
  {
    text: "5 AI property analyses per month",
  },
  {
    text: "Radar market dashboard",
  },
  {
    text: "Top AI opportunities",
  },
  {
    text: "Watchlist for up to 5 assets",
  },
  {
    text: "Public Nestrova research",
  },
];

const realEstateFeatures: PlanFeature[] = [
  {
    text: "Unlimited property analyses",
    emphasized: true,
  },
  {
    text: "AI fair-value estimate",
  },
  {
    text: "Deal Score and investment metrics",
  },
  {
    text: "Rent and yield estimates",
  },
  {
    text: "Saved properties and comparisons",
  },
  {
    text: "Advanced property AI insights",
  },
];

const tradingFeatures: PlanFeature[] = [
  {
    text: "Unlimited Radar Research",
    emphasized: true,
  },
  {
    text: "Unlimited trading watchlists",
    emphasized: true,
  },
  {
    text: "AI opportunity scores",
  },
  {
    text: "Asset intelligence pages",
  },
  {
    text: "Custom trading alerts",
  },
  {
    text: "AI Daily Brief",
  },
  {
    text: "Portfolio intelligence",
  },
];

const allAccessFeatures: PlanFeature[] = [
  {
    text: "Everything in Real Estate Pro",
    emphasized: true,
  },
  {
    text: "Everything in Radar Pro",
    emphasized: true,
  },
  {
    text: "Deep Research — 30 reports per month",
    emphasized: true,
  },
  {
    text: "Research Council — 20 analyses per month",
  },
  {
    text: "Research Compare — 20 comparisons per month",
  },
  {
    text: "Saved Research and PDF reports",
  },
  {
    text: "Research Watch for up to 20 subjects",
  },
  {
    text: "Research History and change alerts",
  },
  {
    text: "Eligible future AI products",
  },
  {
    text: "Premium AI workflows",
  },
  {
    text: "Early access to new features",
  },
  {
    text: "Priority product support",
  },
];

const comparisonRows: ComparisonRow[] = [
  {
    feature: "Property analyses",
    free: "5 / month",
    realEstate: "Unlimited",
    trading: "—",
    allAccess: "Unlimited",
  },
  {
    feature: "Estimated Fair Value",
    free: true,
    realEstate: true,
    trading: false,
    allAccess: true,
  },
  {
    feature: "Deal Score",
    free: "Limited",
    realEstate: "Full",
    trading: "—",
    allAccess: "Full",
  },
  {
    feature: "Rent and yield estimates",
    free: "Limited",
    realEstate: true,
    trading: false,
    allAccess: true,
  },
  {
    feature: "Radar dashboard",
    free: true,
    realEstate: true,
    trading: true,
    allAccess: true,
  },
  {
    feature: "Watchlist assets",
    free: "5",
    realEstate: "5",
    trading: "Unlimited",
    allAccess: "Unlimited",
  },
  {
    feature: "Radar Research",
    free: "10 / month",
    realEstate: "10 / month",
    trading: "Unlimited",
    allAccess: "Unlimited",
  },
  {
    feature: "Asset intelligence",
    free: "Preview",
    realEstate: "Preview",
    trading: "Full",
    allAccess: "Full",
  },
  {
    feature: "Custom AI alerts",
    free: false,
    realEstate: false,
    trading: true,
    allAccess: true,
  },
  {
    feature: "AI Daily Brief",
    free: false,
    realEstate: false,
    trading: true,
    allAccess: true,
  },
  {
    feature: "Portfolio intelligence",
    free: false,
    realEstate: false,
    trading: true,
    allAccess: true,
  },
  {
    feature: "Public Research Feed",
    free: true,
    realEstate: true,
    trading: true,
    allAccess: true,
  },
  {
    feature: "Deep Research",
    free: false,
    realEstate: false,
    trading: false,
    allAccess: "30 / month",
  },
  {
    feature: "Research Council",
    free: false,
    realEstate: false,
    trading: false,
    allAccess: "20 / month",
  },
  {
    feature: "Research Compare",
    free: false,
    realEstate: false,
    trading: false,
    allAccess: "20 / month",
  },
  {
    feature: "Saved Research + PDF",
    free: false,
    realEstate: false,
    trading: false,
    allAccess: true,
  },
  {
    feature: "Research Watch",
    free: false,
    realEstate: false,
    trading: false,
    allAccess: "20 subjects",
  },
  {
    feature: "Research History + Alerts",
    free: false,
    realEstate: false,
    trading: false,
    allAccess: true,
  },
  {
    feature: "Future Nestrova products",
    free: false,
    realEstate: false,
    trading: false,
    allAccess: true,
  },
  {
    feature: "Early feature access",
    free: false,
    realEstate: false,
    trading: false,
    allAccess: true,
  },
];

const faqs = [
  {
    question: "Can I cancel at any time?",
    answer:
      "Yes. You can cancel your PayPal subscription at any time. Your access remains available according to your current billing and subscription status.",
  },
  {
    question: "How does the 5-day trial work?",
    answer:
      "You start with access to the selected paid plan. Unless the subscription is canceled before the trial ends, PayPal automatically begins the monthly billing cycle.",
  },
  {
    question: "Why does Nestrova AI Pro cost $17.99?",
    answer:
      "Real Estate Pro and Radar Pro cost $9.99 each. Nestrova AI Pro combines both and also unlocks Nestrova Research Intelligence, including Deep Research, Research Council, Research Compare, Research Watch, alerts, saved research, and PDF reports.",
  },
  {
    question: "Will Nestrova AI Pro include future products?",
    answer:
      "Eligible future Nestrova AI products are intended to be included for active All Access members. Specialized services or third-party costs may be offered separately.",
  },
  {
    question: "Can I use Nestrova for financial advice?",
    answer:
      "Nestrova is an AI research and decision-support platform, not a financial adviser, brokerage, appraiser, or guarantee of future results. Always verify important information independently.",
  },
  {
    question: "Is payment information stored by Nestrova?",
    answer:
      "Subscription checkout and billing are handled securely through PayPal. Nestrova stores the subscription identifiers and access status needed to manage your account.",
  },
];

function CheckIcon() {
  return (
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-[11px] font-black text-emerald-300">
      ✓
    </span>
  );
}

function PlanFeatureList({
  features,
}: {
  features: PlanFeature[];
}) {
  return (
    <div className="grid content-start gap-3">
      {features.map((feature) => (
        <div
          key={feature.text}
          className="flex items-start gap-3"
        >
          <CheckIcon />

          <p
            className={
              feature.emphasized
                ? "text-sm font-semibold leading-6 text-white/85"
                : "text-sm leading-6 text-white/55"
            }
          >
            {feature.text}
          </p>
        </div>
      ))}
    </div>
  );
}

function ComparisonCell({
  value,
  highlighted = false,
}: {
  value: ComparisonValue;
  highlighted?: boolean;
}) {
  if (typeof value === "boolean") {
    return value ? (
      <span
        className={
          highlighted
            ? "inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-300 text-xs font-black text-black"
            : "inline-flex h-7 w-7 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-xs font-black text-emerald-300"
        }
      >
        ✓
      </span>
    ) : (
      <span className="text-white/20">—</span>
    );
  }

  return (
    <span
      className={
        highlighted
          ? "font-semibold text-white"
          : "text-white/55"
      }
    >
      {value}
    </span>
  );
}

export default function PricingPage() {
  const { isLoaded, isSignedIn } = useUser();

  const paypalClientId =
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  return (
    <main
      id="top"
      className="min-h-screen overflow-hidden bg-[#050505] px-5 py-8 text-white md:px-8 md:py-10"
    >
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.12]" />

        <div className="absolute -left-44 -top-44 h-[760px] w-[760px] rounded-full bg-cyan-400/[0.08] blur-3xl" />

        <div className="absolute right-[-280px] top-20 h-[820px] w-[820px] rounded-full bg-violet-400/[0.08] blur-3xl" />

        <div className="absolute bottom-[-340px] left-[18%] h-[780px] w-[780px] rounded-full bg-emerald-400/[0.09] blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-[1480px] gap-16">
        <header className="flex items-center justify-between gap-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white"
          >
            <span aria-hidden="true">←</span>
            Nestrova
          </a>

          {!isLoaded ? (
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/35">
              Loading...
            </span>
          ) : isSignedIn ? (
            <UserButton />
          ) : (
            <a
              href="/login"
              className="rounded-full border border-white/10 bg-white/[0.05] px-5 py-2 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              Sign in
            </a>
          )}
        </header>

        <section className="grid gap-12 py-8 xl:grid-cols-[1fr_570px] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-amber-300/20 bg-amber-300/[0.08] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
              <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_16px_rgba(252,211,77,0.85)]" />
              Founding Member Pricing
            </div>

            <h1 className="mt-8 max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] md:text-8xl">
              One AI platform.
              <span className="block bg-gradient-to-r from-white via-cyan-100 to-emerald-200 bg-clip-text text-transparent">
                Smarter decisions.
              </span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-white/52 md:text-xl md:leading-9">
              Analyze real estate, discover trading
              opportunities, run multi-perspective AI research,
              create intelligent alerts, and manage decisions
              from one unified Nestrova platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#plans"
                className="rounded-full bg-white px-7 py-4 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
              >
                View plans
              </a>

              <a
                href="/dashboard"
                className="rounded-full border border-white/10 bg-white/[0.055] px-7 py-4 text-sm font-semibold text-white/65 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
              >
                Continue free
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 text-xs font-semibold text-white/38">
              <span className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2">
                5-day free trial
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2">
                Cancel anytime
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2">
                Secure PayPal billing
              </span>

              <span className="rounded-full border border-white/10 bg-white/[0.045] px-4 py-2">
                New features added regularly
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-12 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative overflow-hidden rounded-[46px] border border-white/10 bg-white/[0.065] p-5 shadow-[0_50px_170px_rgba(0,0,0,0.58)] backdrop-blur-2xl md:p-6">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <NestrovaMark className="h-11 w-11 rounded-[14px] text-[14px]" />

                  <div>
                    <p className="text-sm font-semibold">
                      Nestrova Intelligence
                    </p>

                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                      Unified workspace
                    </p>
                  </div>
                </div>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300">
                  Online
                </span>
              </div>

              <div className="mt-5 rounded-[30px] border border-white/10 bg-black/25 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/65">
                  Today&apos;s AI Brief
                </p>

                <div className="mt-4 flex items-start justify-between gap-5">
                  <div>
                    <p className="text-2xl font-semibold tracking-[-0.04em]">
                      Opportunities are strengthening.
                    </p>

                    <p className="mt-3 text-sm leading-6 text-white/40">
                      Nestrova combines property intelligence,
                      market research, risk analysis, and custom
                      monitoring in one workspace.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-center">
                    <p className="text-[9px] uppercase tracking-[0.14em] text-cyan-200/55">
                      Confidence
                    </p>

                    <p className="mt-1 text-2xl font-semibold text-cyan-200">
                      83%
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[27px] border border-white/10 bg-black/20 p-5">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                    Property Score
                  </p>

                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="text-3xl font-semibold">
                      86
                    </p>

                    <span className="text-xs font-semibold text-emerald-300/70">
                      Strong
                    </span>
                  </div>

                  <p className="mt-3 text-xs text-white/35">
                    Investment quality
                  </p>
                </div>

                <div className="rounded-[27px] border border-white/10 bg-black/20 p-5">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                    Top Opportunity
                  </p>

                  <div className="mt-3 flex items-end justify-between gap-3">
                    <p className="text-3xl font-semibold">
                      BTC
                    </p>

                    <p className="text-2xl font-semibold text-cyan-300">
                      91
                    </p>
                  </div>

                  <p className="mt-3 text-xs text-white/35">
                    AI research score
                  </p>
                </div>

                <div className="rounded-[27px] border border-white/10 bg-black/20 p-5">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                    Active Alerts
                  </p>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-3xl font-semibold">
                      3
                    </p>

                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
                  </div>

                  <p className="mt-3 text-xs text-white/35">
                    Conditions recently matched
                  </p>
                </div>

                <div className="rounded-[27px] border border-white/10 bg-black/20 p-5">
                  <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
                    Products
                  </p>

                  <p className="mt-3 text-3xl font-semibold">
                    2+
                  </p>

                  <p className="mt-3 text-xs text-amber-200/60">
                    More AI tools coming
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-[25px] border border-emerald-400/20 bg-emerald-400/[0.07] px-5 py-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-emerald-200/50">
                    Best overall value
                  </p>

                  <p className="mt-1 text-sm font-semibold text-white/75">
                    Real Estate + Radar for $17.99
                  </p>
                </div>

                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-black">
                  Save $2
                </span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/35">
              Why Nestrova
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              Replace scattered research with one AI
              workspace.
            </h2>

            <p className="mt-5 text-base leading-7 text-white/45">
              Spend less time switching between tools and more
              time understanding the opportunities that matter.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {platformFeatures.map((feature) => (
              <article
                key={feature.label}
                className="rounded-[34px] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-2xl"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-lg font-black ${feature.accent}`}
                >
                  {feature.icon}
                </div>

                <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
                  {feature.label}
                </p>

                <h3 className="mt-3 text-xl font-semibold tracking-[-0.03em]">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-white/42">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="plans"
          className="scroll-mt-8"
        >
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white/45">
              Monthly plans · 5-day trial on paid plans
            </div>

            <h2 className="mt-6 text-5xl font-semibold tracking-[-0.065em] md:text-7xl">
              Choose the intelligence you need.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/45">
              Start with one product or unlock the complete
              Nestrova platform at the founding-member rate.
            </p>
          </div>

          {paypalClientId ? (
            <PayPalScriptProvider
              options={{
                clientId: paypalClientId,
                currency: "USD",
                vault: true,
                intent: "subscription",
                components: "buttons",
                disableFunding: "card,credit,paylater",
              }}
            >
              <div className="mt-12 grid items-start gap-6 md:grid-cols-2 xl:grid-cols-4">
                <article className="flex flex-col rounded-[40px] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-2xl">
              <div className="xl:min-h-[250px]">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/30">
                  Free
                </p>

                <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                  Explore Nestrova
                </h3>

                <p className="mt-3 min-h-12 text-sm leading-6 text-white/42">
                  Test the core workflows before choosing a paid
                  product.
                </p>

                <div className="mt-7 flex items-end gap-2">
                  <p className="text-5xl font-semibold tracking-[-0.07em]">
                    $0
                  </p>

                  <p className="pb-2 text-sm text-white/35">
                    forever
                  </p>
                </div>
              </div>

              <div className="my-7 h-px bg-white/10" />

              <div>
                <PlanFeatureList features={freeFeatures} />
              </div>

              <div className="pt-8">
                <a
                  href="/dashboard"
                  className="inline-flex w-full items-center justify-center rounded-full border border-white/10 bg-white/[0.06] px-5 py-4 text-sm font-bold text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  Continue free
                </a>

                <p className="mt-4 text-center text-xs leading-5 text-white/28">
                  No payment method required.
                </p>
              </div>
            </article>

            <article className="flex flex-col rounded-[40px] border border-cyan-400/20 bg-cyan-400/[0.055] p-7 shadow-[0_32px_100px_rgba(34,211,238,0.05)] backdrop-blur-2xl">
              <div className="xl:min-h-[250px]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-cyan-200/55">
                      Real Estate Pro
                    </p>

                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                      Property Intelligence
                    </h3>
                  </div>

                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-cyan-200">
                    Property
                  </span>
                </div>

                <p className="mt-3 min-h-12 text-sm leading-6 text-white/42">
                  Built for home buyers, property researchers,
                  and real-estate investors.
                </p>

                <div className="mt-7 flex items-end gap-2">
                  <p className="text-5xl font-semibold tracking-[-0.07em]">
                    $9.99
                  </p>

                  <p className="pb-2 text-sm text-white/35">
                    / month
                  </p>
                </div>
              </div>

              <div className="my-7 h-px bg-white/10" />

              <div>
                <PlanFeatureList
                  features={realEstateFeatures}
                />
              </div>

              <div className="pt-8">
                <div className="rounded-[26px] border border-cyan-300/15 bg-black/30 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200/55">
                      5-day free trial
                    </p>

                    <div className="text-right">
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                        Due today
                      </p>
                      <p className="mt-1 text-xl font-semibold tracking-[-0.04em] text-white">
                        $0
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[22px] border border-white/10 bg-black/25 p-3">
                    <PayPalSubscriptionButton subscriptionType="real_estate" />
                  </div>

                  <p className="mt-3 text-center text-[11px] font-medium leading-5 text-white/38">
                    Then $9.99/month · Cancel anytime
                  </p>

                  <p className="text-center text-[10px] leading-5 text-white/22">
                    Secure checkout powered by PayPal
                  </p>
                </div>
              </div>
            </article>

            <article className="flex flex-col rounded-[40px] border border-emerald-400/20 bg-emerald-400/[0.055] p-7 shadow-[0_32px_100px_rgba(52,211,153,0.05)] backdrop-blur-2xl">
              <div className="xl:min-h-[250px]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-emerald-200/55">
                      Radar Pro
                    </p>

                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                      Market Intelligence
                    </h3>
                  </div>

                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-emerald-200">
                    Radar
                  </span>
                </div>

                <p className="mt-3 min-h-12 text-sm leading-6 text-white/42">
                  Built for investors who need research,
                  monitoring, watchlists, and alerts.
                </p>

                <div className="mt-7 flex items-end gap-2">
                  <p className="text-5xl font-semibold tracking-[-0.07em]">
                    $9.99
                  </p>

                  <p className="pb-2 text-sm text-white/35">
                    / month
                  </p>
                </div>
              </div>

              <div className="my-7 h-px bg-white/10" />

              <div>
                <PlanFeatureList
                  features={tradingFeatures}
                />
              </div>

              <div className="pt-8">
                <div className="rounded-[26px] border border-emerald-300/15 bg-black/30 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-200/55">
                      5-day free trial
                    </p>

                    <div className="text-right">
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                        Due today
                      </p>
                      <p className="mt-1 text-xl font-semibold tracking-[-0.04em] text-white">
                        $0
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[22px] border border-white/10 bg-black/25 p-3">
                    <PayPalSubscriptionButton subscriptionType="trading" />
                  </div>

                  <p className="mt-3 text-center text-[11px] font-medium leading-5 text-white/38">
                    Then $9.99/month · Cancel anytime
                  </p>

                  <p className="text-center text-[10px] leading-5 text-white/22">
                    Secure checkout powered by PayPal
                  </p>
                </div>
              </div>
            </article>

            <article className="relative flex flex-col overflow-hidden rounded-[40px] border border-amber-300/30 bg-gradient-to-b from-amber-300/[0.12] via-white/[0.075] to-emerald-400/[0.055] p-7 shadow-[0_38px_130px_rgba(252,211,77,0.09)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-300/15 blur-3xl" />

              <div className="relative xl:min-h-[250px]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-amber-200/70">
                      Nestrova AI Pro
                    </p>

                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                      Complete AI Platform
                    </h3>
                  </div>

                  <span className="rounded-full bg-amber-200 px-3 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-black">
                    Most Popular
                  </span>
                </div>

                <p className="mt-3 min-h-12 text-sm leading-6 text-white/52">
                  Unlock both current products and eligible
                  future Nestrova AI experiences.
                </p>

                <div className="mt-7 flex items-end gap-2">
                  <p className="text-5xl font-semibold tracking-[-0.07em]">
                    $17.99
                  </p>

                  <p className="pb-2 text-sm text-white/40">
                    / month
                  </p>
                </div>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold text-emerald-200">
                  Save $2 every month
                </div>
              </div>

              <div className="relative my-7 h-px bg-white/10" />

              <div className="relative">
                <PlanFeatureList
                  features={allAccessFeatures}
                />
              </div>

              <div className="relative pt-8">
                <div className="rounded-[26px] border border-amber-200/20 bg-black/30 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-200/65">
                      5-day free trial
                    </p>

                    <div className="text-right">
                      <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                        Due today
                      </p>
                      <p className="mt-1 text-xl font-semibold tracking-[-0.04em] text-white">
                        $0
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 rounded-[22px] border border-amber-200/15 bg-black/25 p-3">
                    <PayPalSubscriptionButton subscriptionType="all_access" />
                  </div>

                  <p className="mt-3 text-center text-[11px] font-medium leading-5 text-white/42">
                    Then $17.99/month · Cancel anytime
                  </p>

                  <p className="text-center text-[10px] leading-5 text-white/25">
                    Secure checkout powered by PayPal
                  </p>
                </div>
              </div>
                </article>
              </div>
            </PayPalScriptProvider>
          ) : (
            <div className="mt-12 rounded-[32px] border border-red-500/20 bg-red-500/10 p-6 text-center text-sm text-red-200">
              PayPal checkout is temporarily unavailable.
            </div>
          )}

          <p className="mx-auto mt-7 max-w-3xl text-center text-xs leading-6 text-white/30">
            Paid subscriptions renew automatically until
            canceled. Founding-member prices may change for new
            subscribers as Nestrova adds products and
            capabilities.
          </p>
        </section>

        <section className="overflow-hidden rounded-[46px] border border-white/10 bg-white/[0.05] backdrop-blur-2xl">
          <div className="border-b border-white/10 px-7 py-8 md:px-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/30">
              Compare plans
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              See exactly what each plan unlocks.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/42">
              Choose a focused product or combine both with
              Nestrova AI Pro.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[960px] w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="w-[30%] px-7 py-5 text-xs font-semibold uppercase tracking-[0.16em] text-white/30 md:px-10">
                    Feature
                  </th>

                  <th className="px-5 py-5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                    Free
                  </th>

                  <th className="px-5 py-5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-cyan-200/65">
                    Real Estate
                  </th>

                  <th className="px-5 py-5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-emerald-200/65">
                    Radar
                  </th>

                  <th className="bg-amber-300/[0.055] px-5 py-5 text-center text-xs font-bold uppercase tracking-[0.14em] text-amber-200">
                    AI Pro
                  </th>
                </tr>
              </thead>

              <tbody>
                {comparisonRows.map((row) => (
                  <tr
                    key={row.feature}
                    className="border-b border-white/[0.07] last:border-b-0"
                  >
                    <td className="px-7 py-5 text-sm font-medium text-white/65 md:px-10">
                      {row.feature}
                    </td>

                    <td className="px-5 py-5 text-center text-sm">
                      <ComparisonCell value={row.free} />
                    </td>

                    <td className="px-5 py-5 text-center text-sm">
                      <ComparisonCell
                        value={row.realEstate}
                      />
                    </td>

                    <td className="px-5 py-5 text-center text-sm">
                      <ComparisonCell
                        value={row.trading}
                      />
                    </td>

                    <td className="bg-amber-300/[0.035] px-5 py-5 text-center text-sm">
                      <ComparisonCell
                        value={row.allAccess}
                        highlighted
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[46px] border border-white/10 bg-white/[0.05] p-7 backdrop-blur-2xl md:p-10">
          <div className="grid gap-10 xl:grid-cols-[390px_1fr]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-white/30">
                Frequently asked questions
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                Clear answers before you subscribe.
              </h2>

              <p className="mt-5 text-sm leading-7 text-white/42">
                Nestrova is being built as a transparent,
                flexible AI platform. Start small and upgrade
                when the product becomes useful to your
                workflow.
              </p>
            </div>

            <div className="grid gap-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-[28px] border border-white/10 bg-black/20 p-5 open:bg-black/30"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-semibold tracking-[-0.02em] text-white/80">
                    {faq.question}

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-lg font-light text-white/40 transition group-open:rotate-45 group-open:text-white">
                      +
                    </span>
                  </summary>

                  <p className="mt-4 pr-10 text-sm leading-7 text-white/42">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="relative overflow-hidden rounded-[48px] border border-white/10 bg-white/[0.07] p-8 text-center shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-14">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative">
            <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/30">
              Start today
            </p>

            <h2 className="mx-auto mt-5 max-w-5xl text-5xl font-semibold leading-[0.95] tracking-[-0.07em] md:text-7xl">
              Ready to make smarter decisions?
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/45">
              Begin free or unlock the complete Nestrova AI
              platform with a 5-day trial.
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <a
                href="#plans"
                className="rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
              >
                Choose your plan
              </a>

              <a
                href="/dashboard"
                className="rounded-full border border-white/10 bg-white/[0.06] px-8 py-4 text-sm font-semibold text-white/70 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
              >
                Continue free
              </a>
            </div>

            <p className="mt-6 text-xs text-white/28">
              Secure PayPal checkout · Cancel anytime
            </p>
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
