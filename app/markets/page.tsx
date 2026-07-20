import Link from "next/link";
import { cities } from "@/data/cities";

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function MarketsPage() {
  const sorted = [...cities].sort(
    (a, b) => b.investmentScore - a.investmentScore
  );

  return (
    <main className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-5xl font-bold">
        U.S. Real Estate Markets
      </h1>

      <p className="mt-4 max-w-3xl text-gray-600">
        Compare estimated home prices, rents, rental yields,
        and AI investment scores across major U.S. cities.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {sorted.map((city) => {
          const yieldPct =
            ((city.averageRent * 12) / city.medianPrice) * 100;

          return (
            <Link
              key={city.slug}
              href={`/market/${city.slug}`}
              className="rounded-2xl border p-6 transition hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">
                  {city.city}
                </h2>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold">
                  {city.investmentScore}/100
                </span>
              </div>

              <p className="mt-2 text-gray-500">
                {city.state}
              </p>

              <div className="mt-6 space-y-2 text-sm">
                <div>
                  Median Price: {currency(city.medianPrice)}
                </div>

                <div>
                  Rent: {currency(city.averageRent)}
                </div>

                <div>
                  Gross Yield: {yieldPct.toFixed(2)}%
                </div>
              </div>

              <div className="mt-8 text-blue-600 font-semibold">
                View Market →
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}