import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://nestrovaai.com";
const PAGE_URL = `${SITE_URL}/how-much-should-i-offer-on-a-house`;

export const metadata: Metadata = {
  title: "How Much Should I Offer on a House? | Nestrova",
  description:
    "Estimate a reasonable home offer by comparing asking price, fair value, market conditions, property risks, financing costs, and negotiation leverage.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "How Much Should I Offer on a House? | Nestrova",
    description:
      "Use property value, market conditions, risks, and negotiation leverage to prepare a more informed offer.",
    url: PAGE_URL,
    siteName: "Nestrova",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "How Much Should I Offer on a House? | Nestrova",
    description:
      "Estimate a reasonable offer before entering a home negotiation.",
  },
};

const factors = [
  {
    title: "Estimated fair value",
    text: "Start with a reasonable value range based on the property, comparable market evidence, condition, and neighborhood.",
  },
  {
    title: "Seller's asking price",
    text: "The list price is a negotiation starting point, not proof of market value.",
  },
  {
    title: "Days on market",
    text: "A property that has remained unsold for longer may provide more negotiation leverage than a newly listed home.",
  },
  {
    title: "Market competition",
    text: "Multiple offers, inventory levels, and local buyer demand can affect how aggressively you need to bid.",
  },
  {
    title: "Repairs and inspection risk",
    text: "Known repairs, deferred maintenance, and inspection findings may justify a lower offer or seller credit request.",
  },
  {
    title: "Financing and carrying costs",
    text: "Mortgage payments, property taxes, insurance, maintenance, and expected cash flow should support the final price.",
  },
];

const offerRanges = [
  {
    label: "Conservative offer",
    range: "3%–8% below estimated fair value",
    description:
      "May be appropriate when the property has been listed for a long time, requires repairs, or has limited buyer competition.",
  },
  {
    label: "Market-aligned offer",
    range: "Near estimated fair value",
    description:
      "May be appropriate when the listing is reasonably priced and supported by current market evidence.",
  },
  {
    label: "Competitive offer",
    range: "At or above fair value",
    description:
      "May be considered in a highly competitive market, but the buyer should clearly understand the premium and downside risk.",
  },
];

const checklist = [
  "Estimate the property's fair value range.",
  "Review comparable sales and active listings.",
  "Check the property's time on market and price reductions.",
  "Estimate repair, renovation, and inspection-related costs.",
  "Calculate financing and monthly ownership costs.",
  "Identify seller motivation and negotiation leverage.",
  "Set a maximum price before negotiations begin.",
  "Use contingencies and professional advice when appropriate.",
];

const faqs = [
  {
    question: "How much below asking price should I offer?",
    answer:
      "There is no universal percentage. The appropriate discount depends on estimated fair value, property condition, days on market, seller motivation, local competition, and current housing inventory.",
  },
  {
    question: "Should I offer the asking price on a house?",
    answer:
      "You may consider offering the asking price when reliable market evidence supports it and competition is strong. The list price should still be evaluated against fair value, property risks, financing costs, and your maximum budget.",
  },
  {
    question: "Can I offer more than the appraised value?",
    answer:
      "A buyer can offer more than an appraisal, but the lender may limit financing based on the appraised value. The buyer may need additional cash and should understand the risk of paying a premium.",
  },
  {
    question: "What is an insulting low offer?",
    answer:
      "A low offer may be poorly received when it is unsupported by market evidence. A lower offer is more credible when it is accompanied by comparable sales, repair costs, inspection findings, or other objective reasons.",
  },
  {
    question: "Can Nestrova calculate my exact offer price?",
    answer:
      "Nestrova can provide an informational property analysis and decision signals, but it cannot determine a guaranteed or personalized offer price. Final decisions should be independently verified with qualified professionals.",
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
  headline: "How Much Should I Offer on a House?",
  description:
    "A practical framework for evaluating a reasonable offer price on a home.",
  mainEntityOfPage: PAGE_URL,
  author: {
    "@type": "Organization",
    name: "Nestrova",
  },
  publisher: {
    "@type": "Organization",
    name: "Nestrova",
    url: SITE_URL,
  },
};

export default function HowMuchShouldIOfferPage() {
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
              href="/is-this-house-overpriced"
              className="hidden rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              Price Check
            </Link>
            <Link
              href="/analyze"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              Analyze Property
            </Link>
          </div>
        </header>

        <section className="grid gap-10 pb-24 pt-20 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
          <div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
              <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
              Home Offer Strategy
            </div>

            <h1 className="mt-7 max-w-5xl text-5xl font-semibold leading-[0.94] tracking-[-0.07em] md:text-7xl xl:text-8xl">
              How much should you offer on a house?
            </h1>

            <p className="mt-7 max-w-3xl text-lg leading-8 text-white/58 md:text-xl">
              Build a more informed offer using estimated fair value, property
              condition, market competition, financing costs, seller leverage,
              and your maximum acceptable price.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/analyze"
                className="rounded-full bg-white px-7 py-4 text-center text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
              >
                Analyze the Property
              </Link>
              <Link
                href="/property-deal-analyzer"
                className="rounded-full border border-white/10 bg-white/[0.05] px-7 py-4 text-center text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
              >
                Explore Deal Analysis
              </Link>
            </div>

            <p className="mt-5 text-sm text-white/35">
              Informational analysis only. Not real estate, legal, lending, or
              financial advice.
            </p>
          </div>

          <aside className="rounded-[44px] border border-white/10 bg-white/[0.065] p-6 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
              Illustrative Offer Framework
            </p>

            <div className="mt-6 rounded-[32px] border border-white/10 bg-black/25 p-6">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm text-white/40">Example property</p>
                  <h2 className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
                    NEGOTIATE
                  </h2>
                </div>

                <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-center text-emerald-300">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em]">
                    Suggested Range
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    $775K–$800K
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  ["Listing Price", "$835,000"],
                  ["Estimated Fair Value", "$798,000"],
                  ["Days on Market", "41 days"],
                  ["Estimated Repairs", "$12,000"],
                  ["Rental Yield", "5.31%"],
                  ["Deal Score", "74/100"],
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
                The listing appears above estimated fair value, and the time on
                market may support a disciplined offer below the asking price.
              </p>
            </div>
          </aside>
        </section>

        <section className="border-t border-white/10 py-24">
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
              Offer price factors
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              A reasonable offer starts with evidence, not a random discount.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/52">
              The strongest offer strategy considers the property's estimated
              value, market competition, physical condition, seller leverage,
              financing economics, and the buyer's maximum price.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {factors.map((item) => (
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
          <div className="max-w-4xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
              Example offer ranges
            </p>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
              Match the offer to the evidence and the market.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/52">
              These examples are educational frameworks, not fixed rules. Every
              property and negotiation is different.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {offerRanges.map((item) => (
              <article
                key={item.label}
                className="rounded-[34px] border border-white/10 bg-white/[0.05] p-7"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/35">
                  {item.label}
                </p>
                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">
                  {item.range}
                </h3>
                <p className="mt-5 text-sm leading-7 text-white/48">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="border-t border-white/10 py-24">
          <div className="grid gap-10 xl:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-white/35">
                Before submitting an offer
              </p>
              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
                Set your maximum price before negotiations begin.
              </h2>
              <p className="mt-6 text-lg leading-8 text-white/52">
                A clear maximum price can reduce emotional overbidding and help
                you walk away when the economics no longer make sense.
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
              Preparing a home offer.
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
            Prepare your offer
          </p>
          <h2 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.055em] md:text-6xl">
            Analyze the property before deciding your maximum price.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/52">
            Compare value, rent, financing, cash flow, forecast, and risk before
            entering a negotiation.
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
            <Link
              href="/property-deal-analyzer"
              className="transition hover:text-white"
            >
              Deal Analyzer
            </Link>
            <Link
              href="/is-this-house-overpriced"
              className="transition hover:text-white"
            >
              Is This House Overpriced?
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
