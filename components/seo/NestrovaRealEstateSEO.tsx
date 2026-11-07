import Link from "next/link";

const topics = [
  {
    title: "Property value vs. asking price",
    description:
      "Compare the asking price with an estimated value range. Review comparable market information and understand why an asking price may deserve closer examination.",
  },
  {
    title: "Rental income and cash flow",
    description:
      "Estimate monthly rent, then account for expenses such as maintenance, taxes, insurance, vacancy, and financing. Positive gross rent does not necessarily mean positive cash flow.",
  },
  {
    title: "Risk and investment decisions",
    description:
      "Consider financing assumptions, local market conditions, ownership costs, and uncertainty before making an investment or offer decision.",
  },
];

export default function NestrovaRealEstateSEO() {
  return (
    <section
      aria-labelledby="real-estate-investment-guide"
      className="mx-auto w-full max-w-[1480px] px-4 pb-20 pt-8 text-white sm:px-6 lg:px-8"
    >
      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#101720] p-6 sm:p-9 lg:p-12">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#79ddcf]">
          Real Estate Investment Research
        </p>

        <h2
          id="real-estate-investment-guide"
          className="mt-5 max-w-4xl text-3xl font-semibold leading-tight tracking-[-0.045em] sm:text-4xl"
        >
          Understand a real estate investment
          before making a decision.
        </h2>

        <p className="mt-5 max-w-3xl text-sm leading-7 text-white/60 sm:text-base">
          Nestrova brings property research and AI-assisted
          investment analysis together. Explore property
          opportunities, compare an asking price with estimated
          value, evaluate potential rental income, and examine
          the costs and risks that can affect an investment.
        </p>

        <div className="mt-9 grid gap-4 lg:grid-cols-3">
          {topics.map((topic, index) => (
            <article
              key={topic.title}
              className="rounded-[22px] border border-white/10 bg-white/[0.035] p-6"
            >
              <span className="text-xs font-bold text-[#79ddcf]">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="mt-4 text-lg font-semibold tracking-tight">
                {topic.title}
              </h3>

              <p className="mt-3 text-sm leading-7 text-white/55">
                {topic.description}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-8 border-t border-white/10 pt-8 lg:grid-cols-2">
          <div>
            <h3 className="text-xl font-semibold tracking-tight">
              How do you evaluate rental property returns?
            </h3>

            <p className="mt-3 text-sm leading-7 text-white/60">
              Gross rental yield is commonly estimated by
              dividing annual rental income by the purchase
              price and multiplying by 100. It is a starting
              point, not a measure of net profit.
            </p>

            <p className="mt-3 text-sm leading-7 text-white/60">
              Projected monthly cash flow should also account
              for operating expenses and debt service. Results
              depend on the assumptions and the accuracy of
              the underlying property data.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold tracking-tight">
              Explore Nestrova property tools
            </h3>

            <nav
              aria-label="Property research resources"
              className="mt-4 flex flex-col gap-3 text-sm"
            >
              <Link
                href="/property-deal-analyzer"
                className="text-[#8ce6d8] underline-offset-4 hover:underline"
              >
                Learn how the AI property deal analyzer works
              </Link>

              <Link
                href="/analyze"
                className="text-[#8ce6d8] underline-offset-4 hover:underline"
              >
                Analyze a property address
              </Link>

              <Link
                href="/is-this-house-overpriced"
                className="text-[#8ce6d8] underline-offset-4 hover:underline"
              >
                Understand whether a house may be overpriced
              </Link>

              <Link
                href="/how-much-should-i-offer-on-a-house"
                className="text-[#8ce6d8] underline-offset-4 hover:underline"
              >
                Learn how to evaluate an offer price
              </Link>
            </nav>
          </div>
        </div>

        <p className="mt-9 border-t border-white/10 pt-5 text-xs leading-6 text-white/40">
          Nestrova provides informational AI-assisted property
          research. Estimates are not appraisals, verified
          live property listings, or personalized financial
          advice. Independently verify property data and
          consult qualified professionals when appropriate.
        </p>
      </div>
    </section>
  );
}