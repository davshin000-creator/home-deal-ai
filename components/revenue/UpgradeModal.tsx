"use client";

import Link from "next/link";

export default function UpgradeModal({
  open,
  onClose,
  featureName = "this feature",
}: {
  open: boolean;
  onClose: () => void;
  featureName?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="float-right rounded-full bg-gray-100 px-3 py-1 font-bold"
        >
          ×
        </button>

        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Upgrade
        </p>

        <h2 className="mt-2 text-4xl font-bold">
          Unlock {featureName}
        </h2>

        <p className="mt-4 text-gray-600">
          Pro gives serious investors the full Nestrova workflow from analysis to offer strategy.
        </p>

        <div className="mt-6 rounded-2xl bg-gray-50 p-5">
          <ul className="grid gap-3 text-gray-700">
            <li>✓ Unlimited property analysis</li>
            <li>✓ AI reports and coach plans</li>
            <li>✓ Offer Generator and Negotiation Engine</li>
            <li>✓ Printable documents and email drafts</li>
            <li>✓ Weekly Intelligence and portfolio insights</li>
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/pro"
            className="rounded-xl bg-black px-6 py-4 text-center font-semibold text-white hover:bg-gray-800"
          >
            View Pro
          </Link>

          <button
            onClick={onClose}
            className="rounded-xl border px-6 py-4 font-semibold hover:bg-gray-50"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
