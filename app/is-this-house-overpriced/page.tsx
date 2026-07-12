import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://nestrovaai.com";
const PAGE_URL = `${SITE_URL}/is-this-house-overpriced`;

export const metadata: Metadata = {
  title: "Is This House Overpriced? Check Before You Make an Offer | Nestrova",
  description:
    "Check whether a house may be overpriced by comparing the listing price with estimated fair value, rent potential, cash flow, risk, and AI deal signals.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "Is This House Overpriced? | Nestrova",
    description:
      "Get an AI-powered second opinion on a home's asking price before you make an offer.",
    url: PAGE_URL,
    siteName: "Nestrova",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Is This House Overpriced? | Nestrova",
    description:
      "Compare asking price, estimated fair value, rent potential, and risk before buying.",
  },
};

const warningSigns = [
  {
    title: "The asking price exceeds estimated value",
    text: "A large gap between the listing price and estimated fair value may indicate that the home deserves closer review.",
  },
  {
    title: "Comparable value support is weak",
    text: "Recent market data, property characteristics, and neighborhood conditions should reasonably support the seller's price.",
  },
  {
    title: "Rental economics do not work",
    text: "Low rental yield or negative projected cash flow may signal that the purchase price is too aggressive for an investment property.",
  },
  {
    title: "Financing costs erase the upside",
    text: "Mortgage payments, taxes, insurance, maintenance, and other carrying costs can make an apparently attractive property less compelling.",
  },
  {
    title: "The forecast is weaker than the price implies",
    text: "A premium asking price may be difficult to justify when appreciation, neighborhood, or market signals are uncertain.",
  },
  {
    title: "Emotion is replacing verification",
    text: "Competitive bidding and fear of missing out can lead buyers to overlook value gaps and important property risks.",
  },
];

const checklist = [
  "Compare the asking price with an estimated fair value range.",
  "Review recent comparable sales and listing history.",
  "Estimate monthly rent and gross rental yield.",
  "Calculate mortgage and recurring ownership costs.",
  "Check projected monthly cash flow.",
  "Review neighborhood and appreciation signals.",
  "Identify inspection, legal, tax, and financing items that require professional verification.",
];

const faqs = [
  {
    question: "How can I tell if a house is overpriced?",
    answer:
      "Compare the listing price with recent comparable sales, an estimated fair value range, the home's condition, neighborhood trends, rental potential, and financing costs. No single metric is conclusive, so use multiple signals before making an offer.",
  },
  {
    question: "Is the listing price the same as market value?",
    answer:
      "No. The listing price is the seller's asking price. Market value is an estimate of what informed buyers may reasonably pay based on property details and current market evidence.",
  },
  {
    question: "Can an overpriced house still be a good purchase?",
    answer:
      "Possibly, but the buyer should understand why the premium exists and whether location, condition, scarcity, future use, or long-term plans justify it. The risks and opportunity cost should be evaluated carefully.",
  },
  {
    question: "Can Nestrova replace an appraisal?",
    answer:
      "No. Nestrova provides informational analysis and an AI-powered second opinion. It is not a licensed appraisal, inspection, legal review, tax opinion, or personalized financial recommendation.",
  },
  {
    question: "What do I need to run the analysis?",
    answer:
      "Enter the property address and listing price. Optional financing assumptions such as down payment, interest rate, and loan term can improve the relevance of cash-flow estimates.",
  },
];

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

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Is This House Overpriced?",
  description:
    "A practical guide to evaluating whether a home's asking price may be too high.",
  mainEntityOfPage: PAGE_URL,
  publisher: {
    "@type": "Organization",
    name: "Nestrova",
    url: SITE_URL,
  },
};

export default function IsThisHouseOverpricedPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
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
            className="text-lg font-semibold tracking-[-0.04em]"
          >
            Nestrova
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/property-deal-analyzer"
              className="hidden rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              Deal Analyzer
            </Link>
            <Link
              href="/analyze"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              Check a Property
            </Link>
          </div>
        </header>

        <section className="grid gap-10 pb-24 pt-20 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
              <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_18px_rgba(253,224,71,0.75)]" />
              Home Price Check
            </div>

            <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.07em] md:text-7xl xl:text-8xl">
              Is this house overpriced?
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/58 md:text-xl">
              Compare the asking price with estimated fair value, rent
              potential, financing costs, cash flow, neighborhood quality, and
              risk before you make an offer.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/analyze"
                className="rounded-full bg-white px-7 py-4 text-center text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
              >
                Check the House Free
              </Link>
              <Link
                href="/property-deal-analyzer"
                className="rounded-full border border-white/10 bg-white/[0.05] px-7 py-4 text-center text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Learn About the Analyzer
              </Link>
            </div>

            <p className="mt-5 text-sm text-white/35">
              Informational analysis only. Not an appraisal or professional
              advice.
            </p>
          </div>

          <aside className="rounded-[44px] border border-white/10 bg-white/[0.065] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
              Example Price Review
            </p>

            <div className="mt-6 rounded-[32px] border border-white/10 bg-black/25 p-6">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm text-white/40">Illustrative result</p>
                  <h2 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
                    OVERPRICED
                  </h2>
                </div>

                <div className="rounded-3xl border border-rose-400/20 bg-rose-400/10 px-5 py-4 text-center text-rose-300">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                    Price Gap
                  </p>
                  <p className="mt-1 text-4xl font-semibold">8.4%</p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["Listing Price", "$920,000"],
                  ["Estimated Fair Value", "$849,000"],
                  ["Estimated Rent", "$3,850/mo"],
                  ["Gross Rental Yield", "5.02%"],
                  ["Estimated Cash Flow", "-$690/mo"],
                  ["Deal Score", "58/100"],
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

              <p className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-white/52">
                The asking price appears above the estimated value range, while
                projected cash flow and rental yield provide limited support for
                the premium.
              </p>
            </div>
          </aside>
        </section>

        <section className="border-t border-white/10 py-24">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
              Common warning signs
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              A high price is not the only sign of an overpriced house.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/52">
              A property may be overpriced when the seller's asking price is not
              adequately supported by market value, income potential, financing
              economics, condition, or future outlook.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {warningSigns.map((item) => (
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
          <div className="grid gap-10 xl:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
                Buyer checklist
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                What to verify before making an offer.
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/52">
                Use automated analysis as a starting point, then verify the
                property with reliable data and qualified professionals.
              </p>
            </div>

            <div className="grid gap-4">
              {checklist.map((item, index) => (
                <div
                  key={item}
                  className="grid grid-cols-[52px_1fr] items-start gap-4 rounded-[28px] border border-white/10 bg-white/[0.05] p-5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
                    {index + 1}
                  </span>
                  <p className="pt-2 text-sm leading-6 text-white/58">{item}</p>
                </div>
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
              Understanding an overpriced listing.
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
            Before you make an offer
          </p>
          <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
            Check whether the asking price is supported by the deal.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/52">
            Enter the property address and listing price to get an AI-powered
            second opinion.
          </p>
          <Link
            href="/analyze"
            className="mt-8 inline-flex rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
          >
            Analyze the Property
          </Link>
        </section>

        <footer className="flex flex-col gap-5 border-t border-white/10 py-8 text-sm text-white/35 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Nestrova</p>
          <div className="flex flex-wrap gap-5">
            <Link
              href="/property-deal-analyzer"
              className="transition hover:text-white"
            >
              Property Deal Analyzer
            </Link>
            <Link href="/privacy" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-white">
              Terms
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
