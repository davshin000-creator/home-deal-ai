"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import UserAwareNestrovaShell from "@/components/shell/UserAwareNestrovaShell";

type ProStatus = {
  ok: boolean;
  signed_in?: boolean;
  is_pro?: boolean;
  plan?: string;
  subscription_status?: string;
};

export default function CheckoutSuccessPage() {
  const [status, setStatus] = useState<ProStatus | null>(null);

  useEffect(() => {
    async function loadStatus() {
      const response = await fetch("/api/me/pro-status", {
        cache: "no-store",
      });

      const data = await response.json();
      setStatus(data);
    }

    loadStatus();
  }, []);

  return (
    <UserAwareNestrovaShell
      title="Subscription"
      subtitle="Your Nestrova access and membership."
    >
      <div className="mx-auto w-full max-w-[1120px] px-5 py-8 md:px-8 md:py-12">
        <section className="rounded-[32px] border border-white/10 bg-white/[0.035] p-6 md:p-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
            Subscription started
          </p>

          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-[-0.045em] text-white md:text-6xl">
            Welcome to Nestrova Pro.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-white/50 md:text-lg">
            Your 5-day free trial has started. Monthly billing through PayPal
            begins after the trial unless you cancel.
          </p>

          <div className="mt-8 rounded-[24px] border border-white/10 bg-black/20 p-5 md:p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/30">
              Account status
            </p>

            <p className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white md:text-3xl">
              {status === null
                ? "Checking access..."
                : status.is_pro
                  ? "Pro Access Active"
                  : "Pro access pending"}
            </p>

            <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
              {status?.is_pro
                ? "Your account now has access to the features included with your selected Nestrova plan."
                : "If your subscription was just approved, your access may take a few seconds to update."}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <Link
              href="/real-estate"
              className="rounded-[18px] border border-white/10 bg-white px-5 py-4 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              Open Real Estate
            </Link>

            <Link
              href="/trading"
              className="rounded-[18px] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-semibold text-white/70 transition hover:bg-white/[0.07] hover:text-white"
            >
              Open Radar
            </Link>

            <Link
              href="/research"
              className="rounded-[18px] border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-semibold text-white/70 transition hover:bg-white/[0.07] hover:text-white"
            >
              Open Research
            </Link>
          </div>
        </section>
      </div>
    </UserAwareNestrovaShell>
  );
}