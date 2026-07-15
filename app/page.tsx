import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const products = [
  {
    eyebrow: "Property Intelligence",
    title: "Real Estate",
    description:
      "Analyze fair value, rental potential, risk, negotiation leverage, and investment quality in one decision layer.",
    href: "/real-estate",
    action: "Analyze a property",
    status: "Available",
    accent: "emerald",
    features: [
      "AI fair value",
      "Rental intelligence",
      "Risk analysis",
      "Offer strategy",
    ],
  },
  {
    eyebrow: "Market Intelligence",
    title: "Trading",
    description:
      "Explore market regimes, AI Council research, shadow performance, risk conditions, and verified strategy intelligence.",
    href: "/trading",
    action: "Open Trading Intelligence",
    status: "Preview",
    accent: "cyan",
    features: [
      "Market scanner",
      "AI Council",
      "Shadow research",
      "Verified strategies",
    ],
  },
  {
    eyebrow: "Continuous Discovery",
    title: "Research",
    description:
      "Follow safe, aggregated discoveries produced by Nestrova research systems across markets and future intelligence products.",
    href: "/research",
    action: "Explore Research",
    status: "Coming Soon",
    accent: "violet",
    features: [
      "Research feed",
      "Pattern discovery",
      "Evidence tracking",
      "Model evolution",
    ],
  },
];

const intelligencePrinciples = [
  {
    step: "01",
    title: "Observe",
    description:
      "Nestrova continuously collects and normalizes relevant market and property information.",
  },
  {
    step: "02",
    title: "Research",
    description:
      "Specialized intelligence systems evaluate opportunity, risk, context, and competing explanations.",
  },
  {
    step: "03",
    title: "Verify",
    description:
      "Evidence, confidence, historical tracking, and safety standards are reviewed before results are surfaced.",
  },
  {
    step: "04",
    title: "Explain",
    description:
      "Users receive clear decision support instead of unexplained AI output or guaranteed predictions.",
  },
];

const platformStats = [
  ["Products", "3"],
  ["Intelligence Layer", "Unified"],
  ["Execution Access", "None"],
  ["Research Mode", "Continuous"],
];

function productAccent(accent: string) {
  if (accent === "emerald") {
    return {
      label: "text-emerald-300/80",
      glow: "bg-emerald-400/10",
      border: "hover:border-emerald-400/25",
      dot: "bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]",
    };
  }

  if (accent === "cyan") {
    return {
      label: "text-cyan-300/80",
      glow: "bg-cyan-400/10",
      border: "hover:border-cyan-400/25",
      dot: "bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.8)]",
    };
  }

  return {
    label: "text-violet-300/80",
    glow: "bg-violet-400/10",
    border: "hover:border-violet-400/25",
    dot: "bg-violet-400 shadow-[0_0_18px_rgba(167,139,250,0.8)]",
  };
}

export default async function HomePage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();
  const user = data.user;

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.14]" />
        <div className="absolute -left-44 -top-44 h-[760px] w-[760px] rounded-full bg-white/[0.07] blur-3xl" />
        <div className="absolute right-[-260px] top-10 h-[820px] w-[820px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[-320px] left-[20%] h-[780px] w-[780px] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_38%)]" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/75 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between px-5 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-black text-black shadow-[0_0_44px_rgba(255,255,255,0.25)]">
              N
            </div>

            <div>
              <p className="text-sm font-semibold tracking-[-0.03em]">
                Nestrova
              </p>
              <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">
                Verified Intelligence
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-white/50 md:flex">
            <Link
              href="#products"
              className="transition hover:text-white"
            >
              Products
            </Link>

            <Link
              href="/real-estate"
              className="transition hover:text-white"
            >
              Real Estate
            </Link>

            <Link
              href="/trading"
              className="transition hover:text-white"
            >
              Trading
            </Link>

            <Link
              href="/research"
              className="transition hover:text-white"
            >
              Research
            </Link>

            <Link
              href="/pricing"
              className="transition hover:text-white"
            >
              Pricing
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <Link
                href="/dashboard"
                className="hidden rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white md:inline-flex"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="hidden rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white md:inline-flex"
              >
                Login
              </Link>
            )}

            <Link
              href={user ? "/dashboard" : "/login"}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black shadow-[0_22px_70px_rgba(255,255,255,0.18)] transition hover:-translate-y-0.5 hover:bg-neutral-200"
            >
              {user ? "Open Platform" : "Start Free"}
            </Link>
          </div>
        </div>
      </header>

      <section className="relative mx-auto grid max-w-[1480px] gap-14 px-5 py-20 md:px-8 md:py-28 xl:grid-cols-[1fr_540px] xl:items-center">
        <div>
          <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.85)]" />
            AI Intelligence Platform
          </div>

          <h1 className="mt-8 max-w-6xl text-6xl font-semibold leading-[0.88] tracking-[-0.08em] md:text-8xl">
            Better decisions begin with verified intelligence.
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-9 text-white/58">
            Nestrova combines AI research, evidence, confidence, verification,
            and risk analysis across real estate, trading, and future
            intelligence products.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="#products"
              className="rounded-full bg-white px-7 py-4 text-sm font-semibold text-black shadow-[0_24px_80px_rgba(255,255,255,0.2)] transition hover:-translate-y-0.5 hover:bg-neutral-200"
            >
              Explore Products
            </Link>

            <Link
              href="/real-estate"
              className="rounded-full border border-white/10 bg-white/[0.06] px-7 py-4 text-sm font-semibold text-white/70 transition hover:-translate-y-0.5 hover:bg-white/10 hover:text-white"
            >
              Analyze Real Estate
            </Link>
          </div>

          <p className="mt-5 text-sm text-white/35">
            Start with Real Estate Intelligence. Trading Intelligence is now
            entering platform preview.
          </p>

          <div className="mt-12 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {platformStats.map(([label, value]) => (
              <div
                key={label}
                className="rounded-[28px] border border-white/10 bg-white/[0.045] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                  {label}
                </p>
                <p className="mt-2 text-xl font-semibold tracking-[-0.03em]">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 rounded-[56px] bg-white/[0.04] blur-2xl" />

          <div className="relative overflow-hidden rounded-[44px] border border-white/10 bg-white/[0.07] p-6 shadow-[0_46px_160px_rgba(0,0,0,0.62)] backdrop-blur-2xl">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
                  Nestrova Intelligence
                </p>
                <h2 className="mt-3 text-5xl font-semibold tracking-[-0.07em]">
                  Research
                  <br />
                  before action.
                </h2>
              </div>

              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">
                Online
              </div>
            </div>

            <p className="relative mt-6 text-sm leading-7 text-white/58">
              Every Nestrova product follows the same intelligence standard:
              collect evidence, analyze context, verify quality, explain risk,
              and support the user&apos;s final decision.
            </p>

            <div className="relative mt-7 grid gap-3">
              {[
                ["Real Estate", "Fair value, rent, risk, and offer strategy"],
                ["Trading", "Regime, Council, Shadow, and Verified research"],
                ["Research", "Patterns, evidence, and continuous discovery"],
              ].map(([title, description], index) => (
                <div
                  key={title}
                  className="rounded-[26px] border border-white/10 bg-black/25 p-5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-semibold">{title}</p>
                    <p className="text-xs font-semibold text-white/30">
                      0{index + 1}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-white/45">
                    {description}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative mt-5 rounded-[28px] border border-white/10 bg-white/[0.055] p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
                Platform principle
              </p>
              <p className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                Evidence before intelligence.
              </p>
              <p className="mt-2 text-sm leading-6 text-white/45">
                Nestrova does not promise outcomes or replace human judgment.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="products"
        className="relative mx-auto max-w-[1480px] px-5 py-16 md:px-8"
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">
            Choose your intelligence
          </p>

          <h2 className="mt-4 max-w-5xl text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
            One platform. Multiple decision systems.
          </h2>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/50">
            Each product is independently useful while sharing the same
            Nestrova standards for evidence, confidence, verification, and
            transparent risk.
          </p>
        </div>

        <div className="mt-12 grid gap-6 xl:grid-cols-3">
          {products.map((product) => {
            const accent = productAccent(product.accent);

            return (
              <Link
                key={product.title}
                href={product.href}
                className={`group relative overflow-hidden rounded-[42px] border border-white/10 bg-white/[0.055] p-8 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.075] hover:shadow-[0_34px_110px_rgba(0,0,0,0.45)] ${accent.border}`}
              >
                <div
                  className={`absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl ${accent.glow}`}
                />

                <div className="relative">
                  <div className="flex items-center justify-between gap-4">
                    <p
                      className={`text-[11px] font-semibold uppercase tracking-[0.24em] ${accent.label}`}
                    >
                      {product.eyebrow}
                    </p>

                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/45">
                      <span className={`h-1.5 w-1.5 rounded-full ${accent.dot}`} />
                      {product.status}
                    </div>
                  </div>

                  <h3 className="mt-8 text-5xl font-semibold tracking-[-0.06em]">
                    {product.title}
                  </h3>

                  <p className="mt-5 min-h-28 text-base leading-8 text-white/50">
                    {product.description}
                  </p>

                  <div className="mt-8 grid grid-cols-2 gap-3">
                    {product.features.map((feature) => (
                      <div
                        key={feature}
                        className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/48"
                      >
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6">
                    <p className="text-sm font-semibold text-white">
                      {product.action}
                    </p>
                    <span className="text-xl text-white/45 transition group-hover:translate-x-1 group-hover:text-white">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="relative mx-auto max-w-[1480px] px-5 py-16 md:px-8">
        <div className="rounded-[48px] border border-white/10 bg-white/[0.055] p-8 md:p-12">
          <div className="grid gap-10 xl:grid-cols-[420px_1fr]">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">
                Intelligence Standard
              </p>

              <h2 className="mt-4 text-5xl font-semibold tracking-[-0.06em]">
                How Nestrova turns data into decision support.
              </h2>

              <p className="mt-6 text-base leading-8 text-white/48">
                The visible product is simple. Behind it is a repeatable
                process designed to separate raw information from reliable
                intelligence.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {intelligencePrinciples.map((item) => (
                <article
                  key={item.step}
                  className="rounded-[32px] border border-white/10 bg-black/20 p-6"
                >
                  <p className="text-xs font-semibold text-white/25">
                    {item.step}
                  </p>
                  <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-white/45">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1480px] px-5 py-16 md:px-8">
        <div className="overflow-hidden rounded-[48px] border border-white/10 bg-white/[0.06] p-8 md:p-12">
          <div className="grid gap-10 xl:grid-cols-[1fr_420px] xl:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">
                Start with Nestrova
              </p>

              <h2 className="mt-4 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
                Begin with Real Estate. Expand into intelligence.
              </h2>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-white/55">
                Real Estate Intelligence is available now. Trading
                Intelligence is entering preview, with Research Intelligence
                following as the platform expands.
              </p>
            </div>

            <div className="rounded-[36px] border border-white/10 bg-black/25 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/35">
                Nestrova Pro
              </p>

              <div className="mt-4 flex items-end gap-2">
                <p className="text-6xl font-semibold tracking-[-0.06em]">
                  $19
                </p>
                <p className="pb-2 text-white/45">/ month</p>
              </div>

              <p className="mt-4 text-sm leading-6 text-white/45">
                Current Real Estate Pro access. Platform pricing will expand as
                Trading and Research become generally available.
              </p>

              <Link
                href="/pricing"
                className="mt-7 inline-flex w-full justify-center rounded-full bg-white px-6 py-4 text-sm font-semibold text-black transition hover:bg-neutral-200"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-white/10 px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-5 text-sm text-white/35 md:flex-row md:items-center md:justify-between">
          <div>
            <p>© 2026 Nestrova.</p>
            <p className="mt-1">
              Verified intelligence for better decisions.
            </p>
          </div>

          <div className="flex flex-wrap gap-5">
            <Link href="/real-estate" className="hover:text-white">
              Real Estate
            </Link>
            <Link href="/trading" className="hover:text-white">
              Trading
            </Link>
            <Link href="/research" className="hover:text-white">
              Research
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/pricing" className="hover:text-white">
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
