"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  SignInButton,
  UserButton,
  useUser,
} from "@/components/auth/ClerkCompat";

type ReportItem = {
  id: string;
  property_address?: string | null;
  investor_type?: string | null;
  is_full_report?: boolean | null;
  created_at?: string | null;
};

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

export default function ReportsPage() {
  const { isSignedIn, isLoaded } = useUser();

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      setLoading(false);
      setReports([]);
      return;
    }

    void loadReports();
  }, [isLoaded, isSignedIn]);

  async function loadReports() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/reports", {
        method: "GET",
        cache: "no-store",
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        setReports([]);
        setMessage(
          result?.error || "Could not load your AI reports.",
        );
        return;
      }

      // API가 배열을 직접 반환하는 경우와
      // { reports: [...] } 형태를 모두 지원
      const reportList = Array.isArray(result)
        ? result
        : Array.isArray(result?.reports)
          ? result.reports
          : [];

      setReports(reportList);
    } catch (error) {
      console.error("report_history_load_failed", error);
      setReports([]);
      setMessage("Report history connection failed.");
    } finally {
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <main className="min-h-screen bg-[#050505] px-5 py-10 text-white">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-10 w-56 rounded-full bg-white/10" />
          <div className="mt-8 h-64 rounded-[40px] border border-white/10 bg-white/[0.05]" />
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[#050505] px-5 py-12 text-white">
        <div className="pointer-events-none fixed inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.13]" />
          <div className="absolute -left-48 -top-48 h-[720px] w-[720px] rounded-full bg-cyan-400/10 blur-3xl" />
          <div className="absolute bottom-[-300px] right-[-220px] h-[760px] w-[760px] rounded-full bg-emerald-400/10 blur-3xl" />
        </div>

        <section className="relative mx-auto flex min-h-[75vh] max-w-4xl items-center justify-center">
          <div className="w-full rounded-[44px] border border-white/10 bg-white/[0.06] p-8 text-center shadow-[0_40px_140px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:p-12">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300/70">
              Nestrova Reports
            </p>

            <h1 className="mt-5 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">
              Your AI reports are waiting.
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/50">
              Sign in to review previously generated property reports and
              investment recommendations.
            </p>

            <SignInButton mode="modal">
              <button
                type="button"
                className="mt-8 rounded-full bg-white px-7 py-4 text-sm font-semibold text-black transition hover:bg-neutral-200"
              >
                Sign In to View Reports
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
        <div className="absolute -left-48 -top-52 h-[760px] w-[760px] rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute right-[-280px] top-20 h-[820px] w-[820px] rounded-full bg-violet-400/10 blur-3xl" />
        <div className="absolute bottom-[-340px] left-[25%] h-[760px] w-[760px] rounded-full bg-emerald-400/10 blur-3xl" />
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
                <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.8)]" />
                AI Report Library
              </div>

              <h1 className="mt-6 text-5xl font-semibold tracking-[-0.065em] md:text-7xl">
                My AI Reports
              </h1>

              <p className="mt-5 max-w-3xl text-lg leading-8 text-white/48">
                Reopen your previous property analyses, investment summaries,
                and AI-generated recommendations.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-black/25 px-6 py-5">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/30">
                Total Reports
              </p>

              <p className="mt-2 text-4xl font-semibold tracking-[-0.05em]">
                {loading ? "—" : reports.length}
              </p>
            </div>
          </div>
        </section>

        {message ? (
          <section className="mt-6 flex flex-col gap-4 rounded-[28px] border border-red-400/20 bg-red-400/10 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-red-200">
                Reports unavailable
              </p>

              <p className="mt-1 text-sm text-red-100/60">
                {message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => void loadReports()}
              className="rounded-full border border-red-300/20 bg-red-300/10 px-4 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-300/15"
            >
              Try Again
            </button>
          </section>
        ) : null}

        <section className="mt-7">
          {loading ? (
            <div className="grid animate-pulse gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-36 rounded-[30px] border border-white/10 bg-white/[0.05]"
                />
              ))}
            </div>
          ) : reports.length > 0 ? (
            <div className="grid gap-4">
              {reports.map((report, index) => (
                <Link
                  key={report.id}
                  href={`/report/${report.id}`}
                  className="group relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.05] p-6 transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.075] hover:shadow-[0_26px_90px_rgba(0,0,0,0.38)] md:p-7"
                >
                  <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl transition group-hover:bg-cyan-400/15" />

                  <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border border-white/10 bg-black/25 text-sm font-bold text-white/45">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-300/60">
                          Property Intelligence Report
                        </p>

                        <h2 className="mt-2 truncate text-xl font-semibold tracking-[-0.03em] md:text-2xl">
                          {report.property_address?.trim() ||
                            "Property Analysis Report"}
                        </h2>

                        <p className="mt-2 text-sm text-white/35">
                          Generated {formatDate(report.created_at)}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs font-semibold text-white/45">
                        AI Report
                      </span>

                      <span className="text-xl text-white/30 transition group-hover:translate-x-1 group-hover:text-white">
                        →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[40px] border border-white/10 bg-white/[0.05] p-8 text-center backdrop-blur-2xl md:p-12">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[20px] border border-white/10 bg-black/25 text-lg font-bold text-white/50">
                AI
              </div>

              <h2 className="mt-6 text-3xl font-semibold tracking-[-0.045em]">
                No AI reports yet.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/42">
                Analyze a property and select Generate AI Report. Your report
                will appear here automatically.
              </p>

              <Link
                href="/analyze"
                className="mt-7 inline-flex rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
              >
                Analyze Your First Property
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
              href="/analyze"
              className="transition hover:text-white"
            >
              Analyze
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