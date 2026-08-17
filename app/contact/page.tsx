import SiteFooter from "@/components/site/SiteFooter";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-5 py-8 text-white sm:px-6 sm:py-12">
      <section className="mx-auto max-w-5xl overflow-hidden rounded-[36px] border border-white/10 bg-white/[0.045] sm:rounded-[40px]">
        <div className="border-b border-white/10 px-7 py-8 sm:px-10 sm:py-10 lg:px-14">
          <a
            href="/"
            className="text-sm font-semibold text-white/45 transition hover:text-white"
          >
            ← Back to Nestrova
          </a>

          <div className="mt-16 max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">
              Nestrova · Support
            </p>

            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em] sm:text-6xl">
              Contact & Support
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/50">
              Account, subscription, billing, or product questions. Reach the
              Nestrova support team directly.
            </p>

            <p className="mt-7 text-xs font-medium uppercase tracking-[0.16em] text-white/25">
              Last updated · July 2026
            </p>
          </div>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="border-b border-white/10 p-7 sm:p-10 lg:border-b-0 lg:border-r lg:p-14">
            <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/30">
              Customer Support
            </p>

            <h2 className="mt-5 max-w-xl text-3xl font-semibold tracking-[-0.045em]">
              How can we help?
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-white/50">
              If you have any questions regarding your account, subscription,
              billing, or the Nestrova platform, please contact us.
            </p>

            <a
              href="mailto:support@nestrovaai.com"
              className="group mt-9 block rounded-[28px] border border-white/10 bg-white/[0.045] p-7 transition hover:bg-white/[0.07]"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
                    Email
                  </p>

                  <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-white">
                    support@nestrovaai.com
                  </p>
                </div>

                <span className="text-xl text-white/30 transition group-hover:translate-x-1 group-hover:text-white">
                  →
                </span>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/25">
                  Average response time
                </p>

                <p className="mt-2 text-sm text-white/55">
                  Within 24–48 business hours
                </p>
              </div>
            </a>
          </section>

          <div>
            <section className="border-b border-white/10 p-7 sm:p-10 lg:p-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/30">
                Business
              </p>

              <h2 className="mt-5 text-xl font-semibold">
                Nestrova AI
              </h2>

              <p className="mt-3 text-sm leading-7 text-white/45">
                California
                <br />
                United States
              </p>
            </section>

            <section className="p-7 sm:p-10 lg:p-12">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/30">
                Product
              </p>

              <p className="mt-5 text-sm leading-7 text-white/50">
                Nestrova provides AI-powered real estate research, market
                intelligence, and educational trading research.
              </p>

              <p className="mt-5 text-sm leading-7 text-white/35">
                The platform does not execute trades, provide brokerage
                services, or offer personalized financial advice.
              </p>
            </section>
          </div>
        </div>
      </section>

      <div className="mx-auto mt-8 max-w-5xl">
        <SiteFooter
          showProductLinks={false}
          className="rounded-[32px] border border-white/10 bg-white/[0.025] px-6"
        />
      </div>
    </main>
  );
}
