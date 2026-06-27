"use client";

import Link from "next/link";
import { FeatureKey, getUpgradeReason } from "@/lib/revenue/permissions";

export default function FeatureLock({
  feature,
  title,
  description,
}: {
  feature: FeatureKey;
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-3xl border-2 border-black bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-100 text-4xl">
        🔒
      </div>

      <h2 className="mt-6 text-3xl font-bold">{title}</h2>

      <p className="mx-auto mt-3 max-w-2xl text-gray-600">
        {description || getUpgradeReason(feature)}
      </p>

      <div className="mt-6 rounded-2xl bg-gray-50 p-5 text-left">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Pro includes
        </p>
        <ul className="mt-3 grid gap-2 text-gray-700">
          <li>✓ Unlimited AI Analysis</li>
          <li>✓ AI Offer Generator</li>
          <li>✓ Negotiation Engine</li>
          <li>✓ Printable Offer Documents</li>
          <li>✓ Weekly Intelligence</li>
        </ul>
      </div>

      <Link
        href="/pro"
        className="mt-6 inline-block rounded-xl bg-black px-6 py-4 font-semibold text-white hover:bg-gray-800"
      >
        Upgrade to Pro
      </Link>
    </div>
  );
}
