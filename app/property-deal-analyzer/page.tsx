import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://nestrovaai.com";
const PAGE_URL = `${SITE_URL}/property-deal-analyzer`;

export const metadata: Metadata = {
  title: "Property Deal Analyzer | AI Real Estate Analysis | Nestrova",
  description:
    "Analyze a property before you buy. Compare listing price, estimated fair value, rent potential, cash flow, risk, and AI deal score with Nestrova.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Property Deal Analyzer | Nestrova",
    description:
      "Get an AI-powered second opinion on a property before you make an offer.",
    url: PAGE_URL,
    siteName: "Nestrova",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Property Deal Analyzer | Nestrova",
    description:
      "Check fair value, rent potential, cash flow, risk, and AI deal score before you buy.",
  },
};

const benefits = [
  {
    title: "Estimate fair value",
    text: "Compare the listing price with Nestrova's estimated property value range.",
  },
  {
    title: "Review rental potential",
    text: "See estimated monthly rent, gross rental yield, and projected cash flow.",
  },
  {
    title: "Identify major risks",
    text: "Review price, financing, neighborhood, forecast, and carrying-cost signals.",
  },
  {
    title: "Get a clear deal score",
    text: "Turn multiple property signals into one practical investment score and verdict.",
  },
];

const steps = [
  {
    number: "01",
    title: "Enter the property",
    text: "Add the address, listing price, and optional financing assumptions.",
  },
  {
    number: "02",
    title: "Run the analysis",
    text: "Nestrova processes valuation, rental, forecast, neighborhood, and risk signals.",
  },
  {
    number: "03",
    title: "Review the decision",
    text: "Use the result as an informational second opinion before making an offer.",
  },
];

const faqs = [
  {
    question: "What is a property deal analyzer?",
    answer:
      "A property deal analyzer compares a home's asking price with estimated value, rent, financing costs, potential cash flow, and other investment signals. Nestrova combines those inputs into one structured property analysis.",
  },
  {
    question: "Can Nestrova tell me whether a house is overpriced?",
    answer:
      "Nestrova compares the listing price with its estimated fair value and supporting property data. The result can indicate whether the home appears undervalued, fairly priced, or overpriced, but it is an informational estimate rather than an appraisal.",
  },
  {
    question: "Is this financial or real estate advice?",
    answer:
      "No. Nestrova provides informational analysis only. You should independently verify property details and consult qualified real estate, lending, tax, legal, or inspection professionals before making a decision.",
  },
  {
    question: "What information do I need?",
    answer:
      "You need a property address and listing price. You can also enter a down payment, interest rate, and loan term to generate more relevant financing and cash-flow estimates.",
  },
  {
    question: "Can I use it for rental properties?",
    answer:
      "Yes. The analysis includes estimated monthly rent, gross rental yield, financing assumptions, and estimated monthly cash flow, which can help when screening potential rental properties.",
  },
];

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Nestrova Property Deal Analyzer",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  url: PAGE_URL,
  description:
    "AI-powered real estate property analysis for fair value, rent potential, cash flow, risk, and deal scoring.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free property analysis access is available with usage limits.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function PropertyDealAnalyzerPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.13]" />
        <div className="absolute -left-48 -top-48 h-[760px] w-[760px] rounded-full bg-white/[0.07] blur-3xl" />
        <div className="absolute right-[-260px] top-20 h-[820px] w-[820px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[-360px] left-[15%] h-[800px] w-[800px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1440px] px-5 py-6 md:px-8">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="text-lg font-semibold tracking-[-0.04em] text-white"
          >
            Nestrova
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/pricing"
              className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="/analyze"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              Analyze Property
            </Link>
          </div>
        </header>

        <section className="grid gap-8 pb-24 pt-20 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.85)]" />
              AI Property Deal Analyzer
            </div>

            <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.07em] md:text-7xl xl:text-8xl">
              Analyze a property before you make an offer.
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/58 md:text-xl">
              Compare listing price, estimated fair value, rent potential,
              financing, cash flow, neighborhood quality, forecast signals, and
              risk in one AI-powered property analysis.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/analyze"
                className="rounded-full bg-white px-7 py-4 text-center text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
              >
                Analyze a Property Free
              </Link>
              <Link
                href="/pricing"
                className="rounded-full border border-white/10 bg-white/[0.05] px-7 py-4 text-center text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                View Nestrova Pro
              </Link>
            </div>

            <p className="mt-5 text-sm text-white/35">
              Informational analysis only. Not an appraisal or financial advice.
            </p>
          </div>

          <div className="rounded-[44px] border border-white/10 bg-white/[0.065] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
              Property Decision Snapshot
            </p>

            <div className="mt-6 rounded-[32px] border border-white/10 bg-black/25 p-6">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm text-white/40">Illustrative result</p>
                  <h2 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
                    WATCHLIST
                  </h2>
                </div>
                <div className="rounded-3xl border border-amber-300/20 bg-amber-300/10 px-5 py-4 text-center text-amber-200">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                    Deal Score
                  </p>
                  <p className="mt-1 text-4xl font-semibold">72</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["Listing Price", "$850,000"],
                  ["Estimated Fair Value", "$815,000"],
                  ["Estimated Rent", "$3,950/mo"],
                  ["Gross Rental Yield", "5.58%"],
                  ["Estimated Cash Flow", "-$410/mo"],
                  ["Confidence", "78/100"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-[24px] border border-white/10 bg-white/[0.045] p-4"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-white/30">
                      {label}
                    </p>
                    <p className="mt-2 text-lg font-semibold">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/52">
                The property may have long-term potential, but the asking price
                and near-term cash flow require further verification.
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
              What Nestrova analyzes
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              One property. Multiple decision signals.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/52">
              A listing price alone does not tell you whether a property is a
              good deal. Nestrova combines value, income, financing, risk, and
              market signals into a more structured second opinion.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {benefits.map((item) => (
              <article
                key={item.title}
                className="rounded-[32px] border border-white/10 bg-white/[0.05] p-6"
              >
                <h3 className="text-xl font-semibold tracking-[-0.03em]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-6 text-white/48">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-24">
          <div className="grid gap-10 xl:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
                How it works
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                From listing to decision in three steps.
              </h2>
            </div>

            <div className="grid gap-4">
              {steps.map((item) => (
                <article
                  key={item.number}
                  className="grid gap-5 rounded-[30px] border border-white/10 bg-white/[0.05] p-6 md:grid-cols-[80px_1fr]"
                >
                  <p className="text-3xl font-semibold tracking-[-0.05em] text-white/25">
                    {item.number}
                  </p>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.035em]">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-white/48">
                      {item.text}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
              Frequently asked questions
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              Property analysis, explained.
            </h2>
          </div>

          <div className="mt-10 grid gap-4">
            {faqs.map((item) => (
              <details
                key={item.question}
                className="group rounded-[28px] border border-white/10 bg-white/[0.05] p-6"
              >
                <summary className="cursor-pointer list-none text-lg font-semibold tracking-[-0.025em]">
                  {item.question}
                </summary>
                <p className="mt-4 max-w-5xl text-sm leading-7 text-white/50">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-[44px] border border-white/10 bg-white/[0.07] p-8 text-center shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-14">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
            Make a more informed offer
          </p>
          <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
            Check the property before emotion takes over.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/52">
            Use Nestrova as an informational second opinion before you buy,
            negotiate, or walk away.
          </p>
          <Link
            href="/analyze"
            className="mt-8 inline-flex rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
          >
            Start Property Analysis
          </Link>
        </section>

        <footer className="flex flex-col gap-5 border-t border-white/10 py-8 text-sm text-white/35 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Nestrova</p>
          <div className="flex flex-wrap gap-5">
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
            <Link href="/refund" className="transition hover:text-white">
              Refund Policy
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
