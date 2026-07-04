import Link from "next/link";

const brainStats = [
  ["Brain Score", "94"],
  ["Confidence", "97%"],
  ["Fair Value", "$1.58M"],
  ["Offer", "$1.49M"],
];

const modules = [
  ["Analyze", "AI valuation, rent, risk, and negotiation signals in one decision layer."],
  ["Compare", "Rank multiple properties by Brain Score, ROI, forecast, and risk."],
  ["Negotiate", "Generate safe, balanced, and aggressive offer strategies."],
  ["Memo", "Create investor-ready reports for partners, lenders, and agents."],
];

const demoSteps = [
  "Property data normalized",
  "Fair value spread detected",
  "Rental yield checked",
  "Risk guardrails evaluated",
  "Offer strategy generated",
  "Executive verdict prepared",
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-[680px] w-[680px] rounded-full bg-white/[0.08] blur-3xl" />
        <div className="absolute right-[-220px] top-20 h-[760px] w-[760px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[-260px] left-1/4 h-[720px] w-[720px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/70 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-black text-black shadow-[0_0_44px_rgba(255,255,255,0.25)]">
              N
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[-0.03em]">Nestrova</p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">Brain OS</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-white/50 md:flex">
            <Link href="/analyze" className="transition hover:text-white">Analyze</Link>
            <Link href="/brain-console" className="transition hover:text-white">Brain</Link>
            <Link href="/compare" className="transition hover:text-white">Compare</Link>
            <Link href="/memo" className="transition hover:text-white">Memo</Link>
            <Link href="/pricing" className="transition hover:text-white">Pricing</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white md:inline-flex">
              Login
            </Link>
            <Link href="/pricing" className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[0_22px_70px_rgba(255,255,255,0.18)] transition hover:bg-neutral-200">
              Upgrade Pro
            </Link>
          </div>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-[1480px] gap-12 px-5 py-20 md:px-8 md:py-28 xl:grid-cols-[1fr_520px] xl:items-center">
        <div>
          <div className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
            AI Real Estate Investment OS
          </div>

          <h1 className="mt-8 max-w-5xl text-6xl font-semibold leading-[0.9] tracking-[-0.075em] md:text-8xl">
            The AI Operating System for Real Estate Investors.
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-9 text-white/55">
            Analyze, compare, negotiate, and decide with an executive AI brain built for modern property investors.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/analyze" className="rounded-full bg-white px-7 py-4 text-sm font-semibold text-black shadow-[0_24px_80px_rgba(255,255,255,0.2)] transition hover:bg-neutral-200">
              Analyze a Property
            </Link>
            <Link href="/brain-console" className="rounded-full border border-white/10 bg-white/[0.06] px-7 py-4 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white">
              Watch Live Demo
            </Link>
          </div>

          <div className="mt-12 grid max-w-3xl gap-4 md:grid-cols-3">
            {["AI Brain", "Offer Strategy", "Investment Memo"].map((item) => (
              <div key={item} className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <p className="text-sm font-semibold text-white">{item}</p>
                <p className="mt-2 text-sm leading-6 text-white/40">Built for faster, clearer investment decisions.</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[52px] bg-white/[0.04] blur-2xl" />
          <div className="relative overflow-hidden rounded-[42px] border border-white/10 bg-white/[0.07] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">Live Brain</p>
                <h2 className="mt-3 text-5xl font-semibold tracking-[-0.06em]">BUY</h2>
              </div>
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                Online
              </div>
            </div>

            <p className="mt-5 text-sm leading-6 text-white/55">
              157 Damsel appears undervalued with strong negotiation leverage and controlled risk.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              {brainStats.map(([label, value]) => (
                <div key={label} className="rounded-[26px] border border-white/10 bg-black/20 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">{label}</p>
                  <p className="mt-2 text-3xl font-semibold tracking-[-0.04em]">{value}</p>
                </div>
              ))}
            </div>

            <div className="mt-7 rounded-[30px] border border-white/10 bg-black/25 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">Brain Stream</p>
              <div className="mt-4 grid gap-3">
                {demoSteps.map((step) => (
                  <div key={step} className="flex items-center gap-3 text-sm text-white/55">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.85)]" />
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto grid max-w-[1480px] gap-6 px-5 py-10 md:px-8">
        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-[42px] border border-white/10 bg-white/[0.055] p-8 backdrop-blur-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">Without Nestrova</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">Manual research slows every decision.</h2>
            <div className="mt-7 grid gap-3 text-white/45">
              <p>✕ Hours of valuation research</p>
              <p>✕ Emotional offer decisions</p>
              <p>✕ Scattered rental and risk data</p>
              <p>✕ No clear investment memo</p>
            </div>
          </div>

          <div className="rounded-[42px] border border-emerald-400/20 bg-emerald-400/[0.08] p-8 backdrop-blur-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-300/70">With Nestrova</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.05em]">One AI brain for the full deal flow.</h2>
            <div className="mt-7 grid gap-3 text-white/65">
              <p>✓ AI valuation and fair value signal</p>
              <p>✓ Offer strategy and negotiation leverage</p>
              <p>✓ Risk review and executive summary</p>
              <p>✓ Compare, memo, and Brain Console</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1480px] px-5 py-16 md:px-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">Modules</p>
          <h2 className="mt-4 max-w-4xl text-5xl font-semibold tracking-[-0.06em] md:text-6xl">
            Built like an investment desk, designed like a premium AI product.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {modules.map(([title, body]) => (
            <div key={title} className="group rounded-[34px] border border-white/10 bg-white/[0.05] p-6 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.075] hover:shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
              <div className="mb-8 h-10 w-10 rounded-2xl bg-white text-black" />
              <h3 className="text-2xl font-semibold tracking-[-0.04em]">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-white/48">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto max-w-[1480px] px-5 py-16 md:px-8">
        <div className="overflow-hidden rounded-[48px] border border-white/10 bg-white/[0.06] p-8 md:p-12">
          <div className="grid gap-10 xl:grid-cols-[1fr_420px] xl:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">Launch Offer</p>
              <h2 className="mt-4 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
                Start free. Upgrade when the Brain becomes essential.
              </h2>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/55">
                Free users can explore the product. Pro unlocks unlimited analysis, Brain Console, Compare, and Memo.
              </p>
            </div>

            <div className="rounded-[36px] border border-white/10 bg-black/25 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/35">Nestrova Pro</p>
              <div className="mt-4 flex items-end gap-2">
                <p className="text-6xl font-semibold tracking-[-0.06em]">$19</p>
                <p className="pb-2 text-white/45">/ month</p>
              </div>
              <Link href="/pricing" className="mt-7 inline-flex w-full justify-center rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition hover:bg-neutral-200">
                Upgrade Pro
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
