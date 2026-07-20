import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { cities } from "@/data/cities";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;

  const city = cities.find((c) => c.slug === slug);

  if (!city) {
    return {
      title: "City Not Found | Nestrova",
    };
  }

const schema = {
  "@context": "https://schema.org",
  "@type": "Place",
  name: city.city,
  address: {
    "@type": "PostalAddress",
    addressLocality: city.city,
    addressRegion: city.state,
    addressCountry: "US",
  },
};

  return {
    title: `${city.city} Home Value AI | Nestrova`,
    description: `Analyze ${city.city} real estate prices, rental income, market trends, and investment opportunities with Nestrova AI.`,
    keywords: [
      `${city.city} home value`,
      `${city.city} real estate`,
      `${city.city} investment`,
      `${city.city} rent estimate`,
      `${city.city} housing market`,
    ],
  };
}

export default async function CityPage(
  { params }: Props
) {
  const { slug } = await params;

  const city = cities.find((c) => c.slug === slug);

  if (!city) {
    notFound();
  }

const schema = {
  "@context": "https://schema.org",
  "@type": "Place",
  name: city.city,
  address: {
    "@type": "PostalAddress",
    addressLocality: city.city,
    addressRegion: city.state,
    addressCountry: "US",
  },
};

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
        <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
      <h1 className="text-5xl font-bold">
        {city.city} Real Estate AI
      </h1>

      <p className="mt-4 text-lg text-gray-500">
        AI-powered home value analysis and investment insights for{" "}
        {city.city}, {city.state}.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border p-6">
          <h2 className="text-sm text-gray-500">
            Median Home Price
          </h2>

          <p className="mt-2 text-3xl font-bold">
            ${city.medianPrice.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-sm text-gray-500">
            Average Rent
          </h2>

          <p className="mt-2 text-3xl font-bold">
            ${city.averageRent.toLocaleString()}
          </p>
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="text-sm text-gray-500">
            Investment Score
          </h2>

          <p className="mt-2 text-3xl font-bold">
            {city.investmentScore}/100
          </p>
        </div>
      </div>

      <section className="mt-14">
        <h2 className="text-3xl font-bold">
          Analyze Any Property in {city.city}
        </h2>

        <p className="mt-4 text-gray-600">
          Enter any property address in {city.city} to receive an
          AI-powered valuation, rental estimate, investment score,
          comparable sales, and market insights.
        </p>
      </section>
    
    <section className="mt-16 border-t pt-10">
  <h2 className="text-2xl font-bold">
    Explore Other Real Estate Markets
  </h2>

  <div className="mt-6 flex flex-wrap gap-3">
    {cities
      .filter((item) => item.slug !== city.slug)
      .slice(0, 8)
      .map((item) => (
        <Link
          key={item.slug}
          href={`/city/${item.slug}`}
          className="rounded-full border px-4 py-2 text-sm transition hover:bg-gray-100"
        >
          {item.city}, {item.state}
        </Link>
      ))}
  </div>
</section>

    </main>
  );
}