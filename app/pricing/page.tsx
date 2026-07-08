import PayPalCheckoutButton from "@/components/payments/PayPalCheckoutButton";

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
          <a href="/" className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white">
            ← Back to Nestrova
          </a>
          <a href="/login" className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white">
            Login
          </a>
        </header>

        <div className="grid gap-10 py-8 xl:grid-cols-[1fr_520px] xl:items-end">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.85)]" />
              Pricing
            </div>
            <h1 className="mt-8 max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] md:text-8xl">
              Upgrade when the AI Brain becomes essential.
            </h1>
            <p className="mt-8 max-w-3xl text-xl leading-9 text-white/55">
              Start free, validate the workflow, then unlock Nestrova Pro for unlimited analysis, deal comparison, Brain Console, and investor-ready memos.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/40">
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">No long-term contract</span>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">Secure PayPal checkout</span>
              <span className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2">Built for modern investors</span>
            </div>
          </div>

          <div className="rounded-[42px] border border-emerald-400/20 bg-emerald-400/[0.08] p-8 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300/70">Launch Plan</p>
            <div className="mt-4 flex items-end gap-2">
              <p className="text-7xl font-semibold tracking-[-0.08em]">$19</p>
              <p className="pb-3 text-white/45">/ month</p>
            </div>
            <p className="mt-5 text-sm leading-6 text-white/55">
              Best for investors who want one AI workspace for property analysis, comparison, negotiation, and decision support.
            </p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_1.15fr_460px]">
          <div className="rounded-[42px] border border-white/10 bg-white/[0.055] p-8 backdrop-blur-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">Free</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">Explore the system.</h2>
            <p className="mt-4 text-sm leading-6 text-white/45">Get a feel for the workflow before upgrading.</p>
            <div className="mt-8 grid gap-3 text-sm text-white/55">
              {freeFeatures.map((feature) => <p key={feature}>✓ {feature}</p>)}
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
              {proFeatures.map((feature) => <p key={feature}>✓ {feature}</p>)}
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
            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">Pay securely with PayPal.</h2>
            <p className="mt-3 text-sm leading-6 text-white/50">Your Pro access starts after payment confirmation.</p>
            <div className="mt-6 rounded-[30px] border border-white/10 bg-black/25 p-4">
              <PayPalCheckoutButton />
            </div>
            <p className="mt-5 text-xs leading-5 text-white/35">
              Secure checkout is handled by PayPal. Subscription access is managed by Nestrova after payment confirmation.
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
