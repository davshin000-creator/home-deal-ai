import Link from "next/link";
import NestrovaMark from "@/components/brand/NestrovaMark";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import SiteFooter from "@/components/site/SiteFooter";

const products = [
  {
    title: "Real Estate",
    description:
      "Understand a property before you buy, invest, or make an offer.",
    action: "Analyze a Property",
    href: "/real-estate",
    accent: "emerald",
  },
  {
    title: "Trading",
    description:
      "Explore stocks and crypto with clear AI market intelligence.",
    action: "Explore Markets",
    href: "/trading",
    accent: "cyan",
  },
  {
    title: "Research",
    description:
      "Research stocks and crypto with deeper AI analysis and evidence.",
    action: "Start Research",
    href: "/research",
    accent: "violet",
  },
];

function productStyles(accent: string) {
  if (accent === "emerald") {
    return {
      border:
        "hover:border-emerald-300/30",
      glow:
        "bg-emerald-400/10",
      label:
        "text-emerald-200",
      button:
        "text-emerald-200",
    };
  }

  if (accent === "cyan") {
    return {
      border:
        "hover:border-cyan-300/30",
      glow:
        "bg-cyan-400/10",
      label:
        "text-cyan-200",
      button:
        "text-cyan-200",
    };
  }

  return {
    border:
      "hover:border-violet-300/30",
    glow:
      "bg-violet-400/10",
    label:
      "text-violet-200",
    button:
      "text-violet-200",
  };
}

export default async function HomePage() {
  const supabase =
    await createSupabaseServerClient();

  const { data } =
    await supabase.auth.getUser();

  const user = data.user;

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.12]" />

        <div className="absolute -left-52 -top-52 h-[700px] w-[700px] rounded-full bg-white/[0.05] blur-3xl" />

        <div className="absolute right-[-280px] top-10 h-[720px] w-[720px] rounded-full bg-cyan-400/[0.07] blur-3xl" />

        <div className="absolute bottom-[-340px] left-[20%] h-[720px] w-[720px] rounded-full bg-violet-400/[0.06] blur-3xl" />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]/80 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between px-5 py-4 md:px-8">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <NestrovaMark className="h-10 w-10 rounded-[12px] text-[13px]" />

            <div>
              <p className="text-sm font-semibold tracking-[-0.03em]">
                Nestrova
              </p>

              <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                AI Intelligence
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-white/45 md:flex">
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
          </nav>

          <Link
            href={user ? "/dashboard" : "/login"}
            className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
          >
            {user
              ? "Open Platform"
              : "Get Started"}
          </Link>
        </div>
      </header>

      <section className="relative mx-auto max-w-[1320px] px-5 pb-16 pt-20 text-center md:px-8 md:pb-24 md:pt-28">
        <div className="mx-auto max-w-4xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/35">
            Nestrova Intelligence
          </p>

          <h1 className="mt-6 text-[clamp(3.5rem,9vw,7.5rem)] font-semibold leading-[0.88] tracking-[-0.075em]">
            Better decisions,
            <br />
            made simpler.
          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-8 text-white/48 md:text-lg">
            Understand properties, markets,
            and investments with clear AI
            research instead of information
            overload.
          </p>

          <div className="mt-9 flex justify-center">
            <a
              href="/login"
              className="rounded-full border border-white/12 bg-white/[0.05] px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-white/[0.09]"
            >
              Explore Nestrova
            </a>
          </div>
        </div>
      </section>

      <section
        id="explore"
        className="relative mx-auto max-w-[1320px] px-5 py-16 md:px-8 md:py-20"
      >
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/30">
            Choose where to start
          </p>

          <h2 className="mx-auto mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.055em] md:text-5xl">
            What do you want to explore?
          </h2>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {products.map((product) => {
            const styles =
              productStyles(
                product.accent,
              );

            return (
              <Link
                key={product.title}
                href={product.href}
                className={`group relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.045] p-7 transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07] ${styles.border}`}
              >
                <div
                  className={`pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full blur-3xl ${styles.glow}`}
                />

                <div className="relative flex min-h-[250px] flex-col">
                  <p
                    className={`text-[10px] font-bold uppercase tracking-[0.18em] ${styles.label}`}
                  >
                    {product.title}
                  </p>

                  <h3 className="mt-5 text-4xl font-semibold tracking-[-0.055em]">
                    {product.title}
                  </h3>

                  <p className="mt-4 max-w-sm text-sm leading-7 text-white/45">
                    {product.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-6">
                    <span className="text-sm font-semibold">
                      {product.action}
                    </span>

                    <span
                      className={`text-xl transition group-hover:translate-x-1 ${styles.button}`}
                    >
                      &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="relative mx-auto max-w-[1100px] px-5 py-16 md:px-8 md:py-24">
        <div className="rounded-[38px] border border-white/10 bg-white/[0.04] p-7 text-center md:p-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
            How Nestrova helps
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              [
                "01",
                "Analyze",
                "Turn complex information into the facts that matter.",
              ],
              [
                "02",
                "Compare",
                "See opportunities, tradeoffs, and risks more clearly.",
              ],
              [
                "03",
                "Understand",
                "Get clear context before making your own decision.",
              ],
            ].map(
              ([
                number,
                title,
                description,
              ]) => (
                <div
                  key={number}
                  className="rounded-[26px] border border-white/10 bg-black/20 p-6 text-left"
                >
                  <p className="text-xs font-semibold text-white/20">
                    {number}
                  </p>

                  <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em]">
                    {title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-white/40">
                    {description}
                  </p>
                </div>
              ),
            )}
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-[1100px] px-5 pb-24 pt-8 text-center md:px-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/28">
          Built for clarity
        </p>

        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.055em] md:text-5xl">
          Complex data in.
          <br />
          Clearer understanding out.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/42">
          Nestrova helps organize research,
          evidence, opportunity, and risk into
          a simpler view you can understand.
        </p>

      </section>

      <SiteFooter
        showProductLinks={false}
      />
    </main>
  );
}





