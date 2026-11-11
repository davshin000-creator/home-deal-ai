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
  },
  {
    label: "Radar",
    title: "Find opportunities before they disappear.",
    description:
      "Track opportunity scores, market regimes, watchlists, risk levels, and customized alerts.",
  },
  {
    label: "Research Intelligence",
    title: "Investigate signals from multiple AI perspectives.",
    description:
      "Run Deep Research, Research Council, comparisons, saved research, watchlists, history, and change alerts from one evidence-driven workspace.",
  },
  {
    label: "AI Decision Engine",
    title: "Understand the signal, not just the number.",
    description:
      "Turn complex market and property data into clear explanations designed to support better decisions.",
  },
  {
    label: "Growing Platform",
    title: "One account for future Nestrova products.",
    description:
      "All Access members receive eligible future AI products while their subscription remains active.",
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
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/10 text-xs font-black text-emerald-300">
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
      className="nestrova-app-canvas min-h-screen overflow-x-hidden px-4 py-7 text-white sm:px-6 md:px-8 md:py-9"
    >
      <div aria-hidden="true" className="hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.12]" />

        <div className="absolute -left-44 -top-44 h-[760px] w-[760px] rounded-full bg-cyan-400/[0.08] blur-3xl" />

        <div className="absolute right-[-280px] top-20 h-[820px] w-[820px] rounded-full bg-violet-400/[0.08] blur-3xl" />

        <div className="absolute bottom-[-340px] left-[18%] h-[780px] w-[780px] rounded-full bg-emerald-400/[0.09] blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-[1360px] gap-7">
        <header className="flex items-center justify-between gap-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white"
          >
            <span aria-hidden="true">←</span>
            Nestrova
          </a>

          {!isLoaded ? (
            <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/55">
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

        <section
          aria-labelledby="nestrova-plans-title"
          className="border-b border-white/10 pb-5 sm:pb-7"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#70d6c6]">
            Nestrova Membership
          </p>

          <h1
            id="nestrova-plans-title"
            className="mt-3 max-w-3xl text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl"
          >
            Simple plans. Powerful tools.
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-white/60">
            Choose the tools that fit your workflow.
            Compare real estate intelligence, market research,
            and full platform access with clear monthly pricing.
          </p>
        </section>


        <section
          id="plans"
          className="scroll-mt-8"
        >
          <div className="mx-auto max-w-4xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold text-white/45">
              Monthly plans · 5-day trial on paid plans
            </div>

            <h2 className="sr-only">Available membership plans</h2>

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
              <div className="mt-6 grid items-stretch gap-4 md:grid-cols-2 2xl:grid-cols-4">
                <article className="flex flex-col rounded-[22px] border border-white/10 bg-white/[0.045] p-7 backdrop-blur-sm">
              <div className="xl:min-h-[205px]">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-white/55">
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

                  <p className="pb-2 text-sm text-white/55">
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

                <p className="mt-4 text-center text-xs leading-5 text-white/55">
                  No payment method required.
                </p>
              </div>
            </article>

            <article className="flex flex-col rounded-[22px] border border-cyan-400/20 bg-cyan-400/[0.055] p-7 shadow-[0_32px_100px_rgba(34,211,238,0.05)] backdrop-blur-sm">
              <div className="xl:min-h-[205px]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-cyan-200/55">
                      Real Estate Pro
                    </p>

                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                      Property Intelligence
                    </h3>
                  </div>

                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-cyan-200">
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

                  <p className="pb-2 text-sm text-white/55">
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
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200/55">
                      5-day free trial
                    </p>

                    <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">
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

                  <p className="mt-3 text-center text-xs font-medium leading-5 text-white/55">
                    Then $9.99/month · Cancel anytime
                  </p>

                  <p className="text-center text-xs leading-5 text-white/55">
                    Secure checkout powered by PayPal
                  </p>
                </div>
              </div>
            </article>

            <article className="flex flex-col rounded-[22px] border border-white/10 bg-white/[0.045] p-7 shadow-[0_32px_100px_rgba(52,211,153,0.05)] backdrop-blur-sm">
              <div className="xl:min-h-[205px]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-200/55">
                      Radar Pro
                    </p>

                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                      Market Intelligence
                    </h3>
                  </div>

                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-emerald-200">
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

                  <p className="pb-2 text-sm text-white/55">
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
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-200/55">
                      5-day free trial
                    </p>

                    <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">
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

                  <p className="mt-3 text-center text-xs font-medium leading-5 text-white/55">
                    Then $9.99/month · Cancel anytime
                  </p>

                  <p className="text-center text-xs leading-5 text-white/55">
                    Secure checkout powered by PayPal
                  </p>
                </div>
              </div>
            </article>

            <article className="relative flex flex-col overflow-hidden rounded-[22px] border border-[#70d6c6]/35 bg-[#70d6c6]/[0.045] p-7 shadow-[0_38px_130px_rgba(252,211,77,0.09)] backdrop-blur-sm">
              <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-300/15 blur-3xl" />

              <div className="relative xl:min-h-[205px]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-200/70">
                      Nestrova AI Pro
                    </p>

                    <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em]">
                      Complete AI Platform
                    </h3>
                  </div>

                  <span className="rounded-full bg-amber-200 px-3 py-1 text-xs font-black uppercase tracking-[0.12em] text-black">
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
                  features={allAccessFeatures.slice(0, 6)}
                />
              </div>

              <div className="relative pt-8">
                <div className="rounded-[26px] border border-amber-200/20 bg-black/30 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-200/65">
                      5-day free trial
                    </p>

                    <div className="text-right">
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">
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

                  <p className="mt-3 text-center text-xs font-medium leading-5 text-white/42">
                    Then $17.99/month · Cancel anytime
                  </p>

                  <p className="text-center text-xs leading-5 text-white/55">
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

          <p className="mx-auto mt-7 max-w-3xl text-center text-xs leading-6 text-white/55">
            Paid subscriptions renew automatically until
            canceled. Founding-member prices may change for new
            subscribers as Nestrova adds products and
            capabilities.
          </p>
        </section>

        <details className="group overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.025]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-sm font-semibold text-white/85 marker:hidden sm:px-8">
            <span>Compare all plan features</span>
            <span aria-hidden="true" className="text-[#70d6c6] transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
        <section className="overflow-hidden rounded-[22px] border border-white/10 bg-white/[0.05] backdrop-blur-sm">
          <div className="border-b border-white/10 px-7 py-8 md:px-10">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/55">
              Compare plans
            </p>

            <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
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
                  <th className="w-[30%] px-7 py-5 text-xs font-semibold uppercase tracking-[0.16em] text-white/55 md:px-10">
                    Feature
                  </th>

                  <th className="px-5 py-5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
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
        </details>

        <section className="rounded-[22px] border border-white/10 bg-white/[0.05] p-7 backdrop-blur-sm md:p-10">
          <div className="grid gap-10 xl:grid-cols-[390px_1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.26em] text-white/55">
                Frequently asked questions
              </p>

              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
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


        <SiteFooter />
      </div>
    </main>
  );
}
