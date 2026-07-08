"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type ProStatus = { ok: boolean; signed_in?: boolean; is_pro?: boolean; plan?: string; subscription_status?: string };

export default function CheckoutSuccessPage() {
  const [status, setStatus] = useState<ProStatus | null>(null);

  useEffect(() => {
    async function loadStatus() {
      const response = await fetch("/api/me/pro-status", { cache: "no-store" });
      const data = await response.json();
      setStatus(data);
    }
    loadStatus();
  }, []);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] px-5 py-10 text-white md:px-8">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.045)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.13]" />
        <div className="absolute -left-44 -top-44 h-[760px] w-[760px] rounded-full bg-white/[0.075] blur-3xl" />
        <div className="absolute right-[-260px] top-10 h-[820px] w-[820px] rounded-full bg-cyan-400/10 blur-3xl" />
      </div>
      <section className="relative mx-auto max-w-4xl rounded-[48px] border border-white/10 bg-white/[0.07] p-8 shadow-[0_40px_140px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Payment Successful</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-[-0.06em] md:text-7xl">Welcome to Nestrova Pro.</h1>
        <p className="mt-5 text-lg leading-8 text-white/55">Your payment was captured and Pro access is now saved to your account.</p>
        <div className="mt-8 rounded-[32px] border border-white/10 bg-black/25 p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">Account Status</p>
          <p className="mt-3 text-3xl font-semibold tracking-[-0.04em]">{status === null ? "Checking..." : status.is_pro ? "Pro Active" : "Pro not confirmed yet"}</p>
          <p className="mt-2 text-sm text-white/45">{status?.is_pro ? "You can now access Pro workflows." : "If payment just completed, refresh this page in a few seconds."}</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/analyze" className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200">Open Analyze</Link>
          <Link href="/brain-console" className="rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white">Open Brain Console</Link>
          <Link href="/portfolio" className="rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white">Open Portfolio</Link>
        </div>
      </section>
    </main>
  );
}
