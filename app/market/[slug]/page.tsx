import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { generateMarketSummary } from "@/lib/market-ai";
import { cities } from "@/data/cities";

type MarketPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return cities.map((city) => ({
    slug: city.slug,
  }));
}

export async function generateMetadata({
  params,
}: MarketPageProps): Promise<Metadata> {
  const { slug } = await params;
  const market = cities.find((city) => city.slug === slug);

  if (!market) {
    return {
      title: "Market Not Found | Nestrova",
    };
  }

  return {
    title: `${market.city} Real Estate Market Analysis | Nestrova`,
    description: `Explore the ${market.city}, ${market.state} real estate market, including estimated home prices, rent, rental yield, and Nestrova investment score.`,
    alternates: {
      canonical: `https://nestrovaai.com/market/${market.slug}`,
    },
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getRecommendation(score: number) {
  if (score >= 82) {
    return {
      label: "Strong Market",
      description:
        "This market currently shows relatively strong investment fundamentals based on the available estimates.",
    };
  }

  if (score >= 75) {
    return {
      label: "Balanced Opportunity",
      description:
        "This market may offer a balanced opportunity, but individual properties should be analyzed carefully.",
    };
  }

  return {
    label: "Watch Carefully",
    description:
      "This market may require additional research before making an investment decision.",
  };
}

export default async function MarketPage({ params }: MarketPageProps) {
  const { slug } = await params;
  const market = cities.find((city) => city.slug === slug);

  if (!market) {
    notFound();
  }

  const annualRent = market.averageRent * 12;

  const grossRentalYield =
    market.medianPrice > 0
      ? (annualRent / market.medianPrice) * 100
      : 0;
  
  const aiSummary = generateMarketSummary(
  market.investmentScore,
  grossRentalYield
    );

  const recommendation = getRecommendation(market.investmentScore);

  const marketSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${market.city} Real Estate Market Analysis`,
    description: `Estimated real estate market analysis for ${market.city}, ${market.state}.`,
    url: `https://nestrovaai.com/market/${market.slug}`,
    about: {
      "@type": "Place",
      name: `${market.city}, ${market.state}`,
      address: {
        "@type": "PostalAddress",
        addressLocality: market.city,
        addressRegion: market.stateCode,
        addressCountry: "US",
      },
    },
  };

  return (
    <main className="min-h-screen bg-white text-slate-950">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(marketSchema),
        }}
      />

      <section className="mx-auto max-w-6xl px-6 py-16 sm:py-20">
        <div className="max-w-3xl">
          <Link
            href="/markets"
            className="text-sm font-semibold text-slate-600 transition hover:text-slate-950"
          >
            ← All Markets
          </Link>

          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Nestrova Market Intelligence
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-6xl">
            {market.city} Real Estate Market
          </h1>

          <p className="mt-5 text-lg leading-8 text-slate-600">
            AI-assisted market overview for {market.city}, {market.state},
            including estimated pricing, rental income, yield, and investment
            strength.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <article className="rounded-3xl border border-slate-200 p-6">
            <p className="text-sm font-medium text-slate-500">
              Estimated Median Price
            </p>
            <p className="mt-3 text-3xl font-bold">
              {formatCurrency(market.medianPrice)}
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 p-6">
            <p className="text-sm font-medium text-slate-500">
              Estimated Monthly Rent
            </p>
            <p className="mt-3 text-3xl font-bold">
              {formatCurrency(market.averageRent)}
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 p-6">
            <p className="text-sm font-medium text-slate-500">
              Estimated Gross Yield
            </p>
            <p className="mt-3 text-3xl font-bold">
              {grossRentalYield.toFixed(2)}%
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 p-6">
            <p className="text-sm font-medium text-slate-500">
              Investment Score
            </p>
            <p className="mt-3 text-3xl font-bold">
              {market.investmentScore}
              <span className="text-lg text-slate-400">/100</span>
            </p>
          </article>
        </div>

        <section className="mt-12 rounded-3xl border border-slate-200 p-8">
  <h2 className="text-2xl font-bold">
    AI Investment Breakdown
  </h2>

  <div className="mt-8 space-y-6">

    <div>
      <div className="flex justify-between">
        <span>Affordability</span>
        <span>81</span>
      </div>

      <div className="mt-2 h-2 rounded bg-slate-200">
        <div
          className="h-2 rounded bg-blue-600"
          style={{ width: "81%" }}
        />
      </div>
    </div>

    <div>
      <div className="flex justify-between">
        <span>Rental Potential</span>
        <span>87</span>
      </div>

      <div className="mt-2 h-2 rounded bg-slate-200">
        <div
          className="h-2 rounded bg-emerald-500"
          style={{ width: "87%" }}
        />
      </div>
    </div>

    <div>
      <div className="flex justify-between">
        <span>Growth Outlook</span>
        <span>79</span>
      </div>

      <div className="mt-2 h-2 rounded bg-slate-200">
        <div
          className="h-2 rounded bg-purple-500"
          style={{ width: "79%" }}
        />
      </div>
    </div>

    <div>
      <div className="flex justify-between">
        <span>Market Stability</span>
        <span>84</span>
      </div>

      <div className="mt-2 h-2 rounded bg-slate-200">
        <div
          className="h-2 rounded bg-orange-500"
          style={{ width: "84%" }}
        />
      </div>
    </div>

  </div>
</section>

        <section className="mt-10 rounded-3xl bg-slate-950 p-8 text-white sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
            Nestrova Market Signal
          </p>

          <h2 className="mt-4 text-3xl font-bold">
            {recommendation.label}
          </h2>

          <p className="mt-4 max-w-3xl leading-7 text-slate-300">
            {recommendation.description}
          </p>

          <Link
            href="/analyze"
            className="mt-8 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-slate-950 transition hover:bg-slate-200"
          >
            Analyze a Property
          </Link>
        </section>

        <section className="mt-10 rounded-3xl border border-slate-200 p-8">
  <h2 className="text-2xl font-bold">
    Nestrova AI Summary
  </h2>

  <p className="mt-6 leading-8 text-slate-700">
    {aiSummary}
  </p>
</section>

        <section className="mt-14">
          <h2 className="text-2xl font-bold">Explore Other Markets</h2>

          <div className="mt-6 flex flex-wrap gap-3">
            {cities
              .filter((city) => city.slug !== market.slug)
              .slice(0, 8)
              .map((city) => (
                <Link
                  key={city.slug}
                  href={`/market/${city.slug}`}
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-slate-100"
                >
                  {city.city}, {city.stateCode}
                </Link>
              ))}
          </div>
        </section>

        <p className="mt-12 border-t border-slate-200 pt-6 text-xs leading-5 text-slate-500">
          Market values shown on this page are estimated informational data and
          are not financial, appraisal, lending, or investment advice. Analyze
          individual properties and verify current market data before making a
          decision.
        </p>
      </section>
    </main>
  );
}