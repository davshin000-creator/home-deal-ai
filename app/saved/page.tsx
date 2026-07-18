"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  SignInButton,
  UserButton,
  useUser,
} from "@/components/auth/ClerkCompat";

type SavedProperty = {
  id: string;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  listing_price?: number | null;
  fair_value?: number | null;
  estimated_rent?: number | null;
  brain_score?: number | null;
  recommendation?: string | null;
  summary?: string | null;
  strengths?: string[] | null;
  risks?: string[] | null;
  created_at?: string | null;
};

function money(value?: number | null) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getRecommendationStyle(value?: string | null) {
  const normalized = value?.toUpperCase() || "";

  if (
    normalized.includes("BUY") ||
    normalized.includes("UNDERVALUED") ||
    normalized.includes("STRONG")
  ) {
    return "border-emerald-300/20 bg-emerald-300/10 text-emerald-200";
  }

  if (
    normalized.includes("AVOID") ||
    normalized.includes("OVERPRICED") ||
    normalized.includes("SELL")
  ) {
    return "border-red-300/20 bg-red-300/10 text-red-200";
  }

  return "border-amber-300/20 bg-amber-300/10 text-amber-100";
}

export default function SavedDealsPage() {
  const { isSignedIn, isLoaded } = useUser();

  const [properties, setProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setProperties([]);
      setLoading(false);
      return;
    }

    void loadProperties();
  }, [isLoaded, isSignedIn]);

  async function loadProperties() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/saved-properties", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setProperties([]);
        setMessage(
          result?.error || "Could not load your saved properties.",
        );
        return;
      }

      const propertyList = Array.isArray(result?.properties)
        ? result.properties
        : [];

      setProperties(propertyList);
    } catch (error) {
      console.error("saved_properties_load_failed", error);
      setProperties([]);
      setMessage("Saved properties connection failed.");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProperty(id: string) {
    const confirmed = window.confirm(
      "Remove this property from Saved Deals?",
    );

    if (!confirmed) {
      return;
    }

    setDeletingId(id);
    setMessage("");

    try {
      const response = await fetch("/api/saved-properties", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setMessage(
          result?.error || "Could not delete the saved property.",
        );
        return;
      }

      setProperties((current) =>
        current.filter((property) => property.id !== id),
      );
    } catch (error) {
      console.error("saved_property_delete_failed", error);
      setMessage("Could not connect to the delete service.");
    } finally {
      setDeletingId(null);
    }
  }

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#050505] px-5 py-10 text-white">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-10 w-52 rounded-full bg-white/10" />
          <div className="mt-8 h-72 rounded-[40px] border border-white/10 bg-white/[0.05]" />
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050505] px-5 py-12 text-white">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.13]" />
          <div className="absolute -left-48 -top-48 h-[720px] w-[720px] rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="absolute bottom-[-300px] right-[-220px] h-[760px] w-[760px] rounded-full bg-cyan-400/10 blur-3xl" />
        </div>

        <section className="relative mx-auto flex min-h-[75vh] max-w-4xl items-center justify-center">
          <div className="w-full rounded-[44px] border border-white/10 bg-white/[0.06] p-8 text-center shadow-[0_40px_140px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:p-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300/70">
              Nestrova Saved Deals
            </p>

            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
              Your saved properties are waiting.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/50">
              Sign in to review saved investment opportunities and property
              recommendations.
            </p>

            <SignInButton mode="modal">
              <button
                type="button"
                className="mt-8 rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:bg-neutral-200"
              >
                Sign In to View Saved Deals
              </button>
            </SignInButton>

            <div className="mt-7">
              <Link
                href="/"
                className="text-sm font-semibold text-white/45 transition hover:text-white"
              >
                Return to Nestrova →
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.13]" />
        <div className="absolute -left-48 -top-52 h-[760px] w-[760px] rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute right-[-280px] top-20 h-[820px] w-[820px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-[-340px] left-[25%] h-[760px] w-[760px] rounded-full bg-violet-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1300px] px-5 py-6 md:px-8 md:py-8">
        <header className="flex items-center justify-between gap-4">
          <Link
            href="/dashboard"
            className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white"
          >
            ← Dashboard
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/analyze"
              className="hidden rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white sm:inline-flex"
            >
              Analyze Property
            </Link>

            <div className="rounded-full border border-white/10 bg-white/[0.06] p-1">
              <UserButton />
            </div>
          </div>
        </header>

        <section className="mt-10 overflow-hidden rounded-[46px] border border-white/10 bg-white/[0.06] p-7 shadow-[0_42px_140px_rgba(0,0,0,0.48)] backdrop-blur-2xl md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.8)]" />
                Property Watchlist
              </div>

              <h1 className="mt-6 text-5xl font-semibold tracking-[-0.065em] md:text-7xl">
                My Saved Deals
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/48">
                Review properties you saved for future comparison, research,
                and investment decisions.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/25 px-6 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                Saved Properties
              </p>

              <p className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
                {loading ? "—" : properties.length}
              </p>
            </div>
          </div>
        </section>

        {message ? (
          <section className="mt-6 flex flex-col gap-4 rounded-[28px] border border-red-400/20 bg-red-400/10 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-red-200">
                Saved Deals unavailable
              </p>

              <p className="mt-1 text-sm text-red-100/60">
                {message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadProperties()}
              className="rounded-full border border-red-300/20 bg-red-300/10 px-4 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-300/15"
            >
              Try Again
            </button>
          </section>
        ) : null}

        <section className="mt-7">
          {loading ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-80 animate-pulse rounded-[34px] border border-white/10 bg-white/[0.05]"
                />
              ))}
            </div>
          ) : properties.length > 0 ? (
            <div className="grid gap-5 lg:grid-cols-2">
              {properties.map((property) => (
                <article
                  key={property.id}
                  className="relative overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.055] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.25)] backdrop-blur-xl"
                >
                  <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />

                  <div className="relative">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-300/60">
                          Saved Property
                        </p>

                        <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                          {property.address?.trim() || "Saved Property"}
                        </h2>

                        <p className="mt-2 text-sm text-white/35">
                          {[property.city, property.state]
                            .filter(Boolean)
                            .join(", ") || "Location unavailable"}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full border px-3.5 py-2 text-xs font-semibold ${getRecommendationStyle(
                          property.recommendation,
                        )}`}
                      >
                        {property.recommendation || "Review"}
                      </span>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
                          AI Score
                        </p>

                        <p className="mt-2 text-xl font-semibold">
                          {property.brain_score ?? "—"}
                        </p>
                      </div>

                      <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
                          Listing
                        </p>

                        <p className="mt-2 text-base font-semibold">
                          {money(property.listing_price)}
                        </p>
                      </div>

                      <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
                          Fair Value
                        </p>

                        <p className="mt-2 text-base font-semibold">
                          {money(property.fair_value)}
                        </p>
                      </div>

                      <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                        <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/30">
                          Est. Rent
                        </p>

                        <p className="mt-2 text-base font-semibold">
                          {money(property.estimated_rent)}
                        </p>
                      </div>
                    </div>

                    {property.summary ? (
                      <p className="mt-5 line-clamp-3 text-sm leading-7 text-white/42">
                        {property.summary}
                      </p>
                    ) : null}

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                      <p className="text-xs text-white/30">
                        Saved {formatDate(property.created_at)}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/analyze?address=${encodeURIComponent(
                            property.address || "",
                          )}&price=${
                            property.listing_price || ""
                          }`}
                          className="rounded-full bg-white px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-neutral-200"
                        >
                          Open Analysis
                        </Link>

                        <button
                          type="button"
                          onClick={() => void deleteProperty(property.id)}
                          disabled={deletingId === property.id}
                          className="rounded-full border border-red-300/20 bg-red-300/10 px-4 py-2.5 text-xs font-semibold text-red-100 transition hover:bg-red-300/15 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === property.id
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-[40px] border border-white/10 bg-white/[0.05] p-8 text-center backdrop-blur-2xl md:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/10 bg-black/25 text-lg font-bold text-white/50">
                SD
              </div>

              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.045em]">
                No saved deals yet.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/42">
                Analyze a property and select Save Property. It will appear
                here automatically.
              </p>

              <Link
                href="/analyze"
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
              >
                Analyze a Property
              </Link>
            </div>
          )}
        </section>

        <footer className="mt-10 flex flex-col gap-3 border-t border-white/10 py-7 text-sm text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>Nestrova Property Intelligence</p>

          <div className="flex gap-5">
            <Link
              href="/dashboard"
              className="transition hover:text-white"
            >
              Dashboard
            </Link>

            <Link
              href="/reports"
              className="transition hover:text-white"
            >
              Reports
            </Link>

            <Link
              href="/pricing"
              className="transition hover:text-white"
            >
              Pricing
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}