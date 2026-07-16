"use client";

import PayPalSubscriptionButton from "@/components/payments/PayPalSubscriptionButton";
import { useUser, UserButton } from "@/components/auth/ClerkCompat";

const proFeatures = [
  "Unlimited AI property analysis",
  "Nestrova Brain Console",
  "AI Deal Comparison",
  "Investment Memo access",
  "Portfolio and saved deal workflow",
  "Future AI agent features",
];

const freeFeatures = [
  "Explore core property analysis",
  "Preview Nestrova Brain outputs",
  "Test market search workflow",
  "Upgrade only when ready",
];

const faqs = [
  {
    q: "Can I cancel anytime?",
    a: "Yes. Nestrova Pro is designed as a flexible monthly subscription.",
  },
  {
    q: "What does Pro unlock?",
    a: "Pro unlocks unlimited analysis, Brain Console, Compare, Memo, and advanced AI investment workflows.",
  },
  {
    q: "Is this financial advice?",
    a: "No. Nestrova is an AI decision-support tool. Verify property data and consult qualified professionals before making investment decisions.",
  },
];

export default function PricingPage() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <main id="top" className="min-h-screen overflow-hidden bg-[#050505] px-5 py-10 text-white md:px-8">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.13]" />
        <div className="absolute -left-44 -top-44 h-[760px] w-[760px] rounded-full bg-white/[0.075] blur-3xl" />
        <div className="absolute right-[-260px] top-10 h-[820px] w-[820px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[-320px] left-[20%] h-[780px] w-[780px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <section className="relative mx-auto grid max-w-[1480px] gap-10">
        <header className="flex items-center justify-between gap-4">
  <a
    href="/"
    className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white"
  >
    Back to Nestrova
  </a>

  {!isLoaded ? (
    <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/40">
      Loading...
    </span>
  ) : isSignedIn ? (
    <UserButton />
  ) : (
    <a
      href="/login"
      className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white"
    >
      Login
    </a>
  )}
</header>

        <div className="grid gap-10 py-8 xl:grid-cols-[1fr_560px] xl:items-center">
  <div>
    <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
      <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.85)]" />
      Nestrova Intelligence Platform
    </div>

    <h1 className="mt-8 max-w-5xl text-6xl font-semibold leading-[0.88] tracking-[-0.08em] md:text-8xl">
      One AI.
      <span className="block bg-gradient-to-r from-white via-cyan-100 to-emerald-200 bg-clip-text text-transparent">
        Every Investment.
      </span>
    </h1>

    <p className="mt-8 max-w-3xl text-xl leading-9 text-white/55">
      Real Estate Intelligence, Trading Research, Watchlist Alerts,
      Portfolio Analytics, and future AI Copilot tools—all inside one
      decision platform.
    </p>

    <div className="mt-8 flex flex-wrap gap-3">
      <a
        href="/dashboard"
        className="rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
      >
        Start Free
      </a>

      <a
        href="#plans"
        className="rounded-full border border-white/10 bg-white/[0.06] px-7 py-4 text-sm font-semibold text-white/70 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
      >
        Explore Pro
      </a>
    </div>

    <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/40">
      <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
        Real Estate AI
      </span>

      <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
        Trading Intelligence
      </span>

      <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
        Private Watchlists
      </span>

      <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">
        Secure PayPal Checkout
      </span>
    </div>
  </div>

  <div className="relative">
    <div className="absolute -inset-10 rounded-full bg-cyan-400/10 blur-3xl" />

    <div className="relative overflow-hidden rounded-[46px] border border-white/10 bg-white/[0.065] p-5 shadow-[0_50px_170px_rgba(0,0,0,0.58)] backdrop-blur-2xl md:p-6">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-xs font-black text-black">
            N
          </div>

          <div>
            <p className="text-sm font-semibold">
              Nestrova Daily Intelligence
            </p>

            <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
              Live Platform Preview
            </p>
          </div>
        </div>

        <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-300">
          Online
        </span>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-[28px] border border-white/10 bg-black/25 p-5 sm:col-span-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-300/65">
                AI Daily Brief
              </p>

              <p className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                Market conditions are improving.
              </p>

              <p className="mt-3 text-sm leading-6 text-white/40">
                Public research indicates stronger momentum with controlled
                risk and several assets entering watch conditions.
              </p>
            </div>

            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-center">
              <p className="text-[9px] uppercase tracking-[0.14em] text-cyan-200/60">
                Confidence
              </p>

              <p className="mt-1 text-2xl font-semibold text-cyan-200">
                83%
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
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
            Multi-timeframe research score
          </p>
        </div>

        <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
            Market Regime
          </p>

          <p className="mt-3 text-3xl font-semibold">
            Bullish
          </p>

          <p className="mt-3 text-xs text-emerald-300/65">
            Medium risk · improving
          </p>
        </div>

        <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
            Watchlist Alerts
          </p>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-3xl font-semibold">
              3
            </p>

            <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.9)]" />
          </div>

          <p className="mt-3 text-xs text-white/35">
            Conditions matched recently
          </p>
        </div>

        <div className="rounded-[26px] border border-white/10 bg-black/20 p-5">
          <p className="text-[9px] uppercase tracking-[0.14em] text-white/28">
            Property Intelligence
          </p>

          <p className="mt-3 text-3xl font-semibold">
            86
          </p>

          <p className="mt-3 text-xs text-emerald-300/65">
            Strong investment quality
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.14em] text-white/25">
            Unified Workspace
          </p>

          <p className="mt-1 text-sm font-semibold text-white/70">
            Property · Markets · Alerts · Research
          </p>
        </div>

        <span className="text-xl text-white/35">
          →
        </span>
      </div>
    </div>

    <div className="relative mx-auto -mt-5 w-[88%] rounded-[30px] border border-emerald-400/20 bg-[#0a1511]/95 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-300">
              Most Popular
            </span>

            <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/40">
              5-Day Trial
            </span>
          </div>

          <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/30">
            Nestrova Pro
          </p>

          <div className="mt-2 flex items-end gap-2">
            <p className="text-5xl font-semibold tracking-[-0.07em]">
              $19
            </p>

            <p className="pb-2 text-sm text-white/40">
              / month
            </p>
          </div>
        </div>

        <a
          href="#plans"
          className="rounded-full bg-white px-5 py-3 text-center text-sm font-semibold text-black transition hover:bg-neutral-200"
        >
          View Pro Benefits
        </a>
      </div>
    </div>
  </div>
</div>

        <div
            id="plans"
            className="scroll-mt-8 grid gap-6 xl:grid-cols-[1fr_1.15fr_460px]"
        >
          <div className="rounded-[42px] border border-white/10 bg-white/[0.055] p-8 backdrop-blur-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">Free</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">Explore the system.</h2>
            <p className="mt-4 text-sm leading-6 text-white/45">Get a feel for the workflow before upgrading.</p>
            <div className="mt-8 grid gap-3 text-sm text-white/55">
            {freeFeatures.map((feature) => (
  <p key={feature}>• {feature}</p>
))}
            </div>
            <a href="/analyze" className="mt-8 inline-flex w-full justify-center rounded-full border border-white/10 bg-white/[0.06] px-6 py-4 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white">
              Start Free Analysis
            </a>
          </div>

          <div className="relative overflow-hidden rounded-[42px] border border-white/10 bg-white/[0.075] p-8 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">Nestrova Pro</p>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">Unlock the full AI investment brain.</h2>
              </div>
              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                Recommended
              </span>
            </div>
            <div className="relative mt-8 grid gap-3 text-sm text-white/65 md:grid-cols-2">
              {proFeatures.map((feature) => (
  <p key={feature}>• {feature}</p>
))}
            </div>
            <div className="relative mt-8 grid gap-4 md:grid-cols-3">
              {[["Brain", "Live decision engine"], ["Compare", "Rank multiple deals"], ["Memo", "Investor-ready reports"]].map(([title, body]) => (
                <div key={title} className="rounded-[26px] border border-white/10 bg-black/25 p-4">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-2 text-xs leading-5 text-white/40">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[42px] border border-white/10 bg-white/[0.075] p-8 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">Checkout</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
  Start your 5-day free trial.
</h2>

<p className="mt-3 text-sm leading-6 text-white/50">
  Subscribe with PayPal today. Your first 5 days are free, then Nestrova Pro renews automatically at $19/month until canceled.
</p>
            <div className="mt-6 rounded-[30px] border border-white/10 bg-black/25 p-4">
              <PayPalSubscriptionButton />
            </div>
            <p className="mt-5 text-xs leading-5 text-white/35">
  Secure subscription checkout is handled by PayPal. Cancel anytime. Unless canceled before the trial ends, your subscription automatically renews at $19/month.
</p>
          </aside>
        </div>

        <section className="rounded-[48px] border border-white/10 bg-white/[0.055] p-8 backdrop-blur-2xl md:p-10">
          <div className="grid gap-8 xl:grid-cols-[420px_1fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">FAQ</p>
              <h2 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">Built for a clean launch.</h2>
              <p className="mt-4 text-sm leading-6 text-white/45">Keep pricing simple. Let users understand the value quickly.</p>
            </div>
            <div className="grid gap-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                  <h3 className="text-lg font-semibold tracking-[-0.02em]">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-white/45">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[48px] border border-white/10 bg-white/[0.07] p-8 text-center shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">Ready</p>
          <h2 className="mx-auto mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
            Start with one property. Upgrade when you want the full investment brain.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="/analyze" className="rounded-full border border-white/10 bg-white/[0.06] px-7 py-4 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white">
              Start Free
            </a>
            <a href="#top" className="rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:bg-neutral-200">
              Choose Pro
            </a>
          </div>
        </section>
      </section>
    </main>
  );
}


