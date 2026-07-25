import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUserProfile } from "@/lib/supabase/server";
import {
  getEntitlements,
  getSubscriptionDisplayName,
  hasActiveSubscription,
  normalizeSubscriptionStatus,
  normalizeSubscriptionType,
  type FeatureKey,
} from "@/lib/subscriptions/entitlements";

export const dynamic = "force-dynamic";

type BillingProfile = {
  email?: string | null;
  is_pro?: boolean | null;
  plan?: string | null;
  subscription_type?: string | null;
  entitlements?: unknown;
  subscription_status?: string | null;
  paypal_subscription_id?: string | null;
  paypal_plan_id?: string | null;
  trial_started_at?: string | null;
  trial_ends_at?: string | null;
  subscription_updated_at?: string | null;
  cancel_at_period_end?: boolean | null;
};

function formatDate(value: unknown): string {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "Not available";
  }

  const date = new Date(String(value));

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function maskIdentifier(value: unknown): string {
  if (typeof value !== "string") {
    return "Not connected";
  }

  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return "Not connected";
  }

  if (normalizedValue.length <= 8) {
    return "••••••••";
  }

  return `${normalizedValue.slice(
    0,
    4,
  )}••••••••${normalizedValue.slice(-4)}`;
}

function getStatusLabel(status: string): string {
  const statusLabels: Record<string, string> = {
    active: "Active",
    trialing: "Free trial",
    approved: "Approved",
    approval_pending: "Approval pending",
    suspended: "Suspended",
    cancelled: "Canceled",
    canceled: "Canceled",
    expired: "Expired",
    free: "Free",
  };

  return statusLabels[status] ?? "Unknown";
}

function getStatusClasses(status: string): string {
  if (
    status === "active" ||
    status === "trialing" ||
    status === "approved"
  ) {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  if (
    status === "approval_pending" ||
    status === "suspended"
  ) {
    return "border-amber-400/20 bg-amber-400/10 text-amber-200";
  }

  if (
    status === "cancelled" ||
    status === "canceled" ||
    status === "expired"
  ) {
    return "border-red-400/20 bg-red-400/10 text-red-200";
  }

  return "border-white/10 bg-white/[0.06] text-white/45";
}

function getFeatureName(feature: FeatureKey): string {
  const names: Record<FeatureKey, string> = {
    real_estate: "Real Estate AI",
    trading: "Trading Intelligence",
    research: "AI Research",
    business: "Business AI",
    startup: "Startup Intelligence",
    relationship: "Relationship AI",
  };

  return names[feature];
}

function AccessCard({
  title,
  description,
  enabled,
  href,
}: {
  title: string;
  description: string;
  enabled: boolean;
  href: string;
}) {
  return (
    <article
      className={
        enabled
          ? "rounded-[30px] border border-emerald-400/20 bg-emerald-400/[0.065] p-6"
          : "rounded-[30px] border border-white/10 bg-black/20 p-6"
      }
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold tracking-[-0.025em]">
            {title}
          </p>

          <p className="mt-2 text-sm leading-6 text-white/42">
            {description}
          </p>
        </div>

        <span
          className={
            enabled
              ? "rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300"
              : "rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white/30"
          }
        >
          {enabled ? "Unlocked" : "Locked"}
        </span>
      </div>

      <Link
        href={enabled ? href : "/pricing"}
        className={
          enabled
            ? "mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-200 transition hover:text-white"
            : "mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/45 transition hover:text-white"
        }
      >
        {enabled ? "Open product" : "View upgrade options"}
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

export default async function BillingPage() {
  const { user, profile } =
    await getCurrentUserProfile();

  if (!user) {
    redirect("/login?next=/settings/billing");
  }

  const billingProfile =
    (profile ?? {}) as BillingProfile;

  const subscriptionType =
    normalizeSubscriptionType(
      billingProfile.subscription_type ??
        billingProfile.plan,
    );

  const subscriptionStatus =
    normalizeSubscriptionStatus(
      billingProfile.subscription_status,
    ) || "free";

  const entitlements =
    getEntitlements(billingProfile);

  const activeSubscription =
    hasActiveSubscription(billingProfile);

  const canUseRealEstate =
    entitlements.includes("real_estate") &&
    activeSubscription;

  const canUseTrading =
    entitlements.includes("trading") &&
    activeSubscription;

  const displayName =
    getSubscriptionDisplayName(subscriptionType);

  const trialEndsAt = formatDate(
    billingProfile.trial_ends_at,
  );

  const subscriptionUpdatedAt = formatDate(
    billingProfile.subscription_updated_at,
  );

  const email =
    user.email ??
    billingProfile.email ??
    "Signed-in account";

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] px-5 py-8 text-white md:px-8 md:py-10">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:72px_72px] opacity-[0.12]" />

        <div className="absolute -left-48 -top-48 h-[720px] w-[720px] rounded-full bg-cyan-400/[0.08] blur-3xl" />

        <div className="absolute right-[-260px] top-20 h-[760px] w-[760px] rounded-full bg-violet-400/[0.07] blur-3xl" />

        <div className="absolute bottom-[-300px] left-[22%] h-[720px] w-[720px] rounded-full bg-emerald-400/[0.08] blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-[1280px] gap-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/dashboard"
              className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm font-semibold text-white/55 transition hover:bg-white/10 hover:text-white"
            >
              ← Dashboard
            </Link>

            <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/35">
              {email}
            </span>
          </div>

          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-neutral-200"
          >
            View plans
          </Link>
        </header>

        <section className="grid gap-8 py-6 xl:grid-cols-[1fr_420px] xl:items-end">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/30">
              Account and billing
            </p>

            <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-[0.94] tracking-[-0.065em] md:text-7xl">
              Manage your
              <span className="block bg-gradient-to-r from-white via-cyan-100 to-emerald-200 bg-clip-text text-transparent">
                Nestrova membership.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/45">
              Review your current plan, active product access,
              trial information, and PayPal subscription
              connection.
            </p>
          </div>

          <div className="rounded-[34px] border border-white/10 bg-white/[0.055] p-6 backdrop-blur-2xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">
              Current membership
            </p>

            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-3xl font-semibold tracking-[-0.045em]">
                  {displayName}
                </p>

                <p className="mt-2 text-sm text-white/40">
                  {activeSubscription
                    ? "Your paid access is currently available."
                    : subscriptionType === "free"
                      ? "You are currently using the free plan."
                      : "Your paid access is not currently active."}
                </p>
              </div>

              <span
                className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.13em] ${getStatusClasses(
                  subscriptionStatus,
                )}`}
              >
                {getStatusLabel(subscriptionStatus)}
              </span>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-[40px] border border-white/10 bg-white/[0.055] p-7 backdrop-blur-2xl md:p-8">
            <div className="flex flex-col gap-4 border-b border-white/10 pb-7 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
                  Subscription overview
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em]">
                  {displayName}
                </h2>
              </div>

              {subscriptionType === "all_access" && (
                <span className="w-fit rounded-full bg-amber-200 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-black">
                  Complete platform
                </span>
              )}
            </div>

            <dl className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[25px] border border-white/10 bg-black/20 p-5">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/28">
                  Subscription status
                </dt>

                <dd className="mt-3 text-lg font-semibold text-white/75">
                  {getStatusLabel(subscriptionStatus)}
                </dd>
              </div>

              <div className="rounded-[25px] border border-white/10 bg-black/20 p-5">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/28">
                  Trial ends
                </dt>

                <dd className="mt-3 text-lg font-semibold text-white/75">
                  {subscriptionStatus === "trialing"
                    ? trialEndsAt
                    : "Not currently trialing"}
                </dd>
              </div>

              <div className="rounded-[25px] border border-white/10 bg-black/20 p-5">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/28">
                  PayPal subscription
                </dt>

                <dd className="mt-3 break-all text-sm font-semibold text-white/65">
                  {maskIdentifier(
                    billingProfile.paypal_subscription_id,
                  )}
                </dd>
              </div>

              <div className="rounded-[25px] border border-white/10 bg-black/20 p-5">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/28">
                  Last updated
                </dt>

                <dd className="mt-3 text-lg font-semibold text-white/75">
                  {subscriptionUpdatedAt}
                </dd>
              </div>
            </dl>

            {billingProfile.cancel_at_period_end && (
              <div className="mt-6 rounded-[25px] border border-amber-400/20 bg-amber-400/10 p-5">
                <p className="text-sm font-semibold text-amber-200">
                  Cancellation scheduled
                </p>

                <p className="mt-2 text-sm leading-6 text-amber-100/55">
                  Your subscription is marked to end after the
                  current billing period.
                </p>
              </div>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:bg-neutral-200"
              >
                Change or upgrade plan
              </Link>

              {billingProfile.paypal_subscription_id ? (
                <a
                  href="https://www.paypal.com/myaccount/autopay/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
                >
                  Manage in PayPal ↗
                </a>
              ) : (
                <Link
                  href="/pricing"
                  className="rounded-full border border-white/10 bg-white/[0.06] px-6 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
                >
                  Connect a paid plan
                </Link>
              )}
            </div>

            <p className="mt-5 text-xs leading-5 text-white/28">
              Billing and payment-method changes are completed
              through PayPal. Nestrova controls access according
              to the subscription status received from PayPal.
            </p>
          </article>

          <aside className="rounded-[40px] border border-white/10 bg-white/[0.055] p-7 backdrop-blur-2xl md:p-8">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
              Included access
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em]">
              Your AI products
            </h2>

            {entitlements.length > 0 &&
            activeSubscription ? (
              <div className="mt-7 grid gap-3">
                {entitlements.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center justify-between gap-4 rounded-[22px] border border-emerald-400/20 bg-emerald-400/[0.065] px-4 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-300 text-xs font-black text-black">
                        ✓
                      </span>

                      <span className="text-sm font-semibold text-white/75">
                        {getFeatureName(feature)}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-emerald-300/65">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-7 rounded-[25px] border border-white/10 bg-black/20 p-5">
                <p className="text-sm font-semibold text-white/65">
                  No paid products unlocked
                </p>

                <p className="mt-2 text-sm leading-6 text-white/38">
                  Continue using the free tools or select a plan
                  to unlock additional Nestrova products.
                </p>
              </div>
            )}

            <div className="mt-6 rounded-[25px] border border-amber-300/20 bg-amber-300/[0.07] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-200/60">
                Best value
              </p>

              <p className="mt-3 text-lg font-semibold">
                Nestrova AI Pro
              </p>

              <p className="mt-2 text-sm leading-6 text-white/42">
                Unlock Real Estate AI and Trading Intelligence
                together for $17.99 per month.
              </p>

              <Link
                href="/pricing#plans"
                className="mt-5 inline-flex text-sm font-semibold text-amber-200 transition hover:text-white"
              >
                Compare all plans →
              </Link>
            </div>
          </aside>
        </section>

        <section>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/30">
              Product access
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-[-0.055em]">
              Continue your workflow.
            </h2>
          </div>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            <AccessCard
              title="Real Estate AI"
              description="Property analysis, fair value, rent estimates, Deal Scores, comparisons, and saved research."
              enabled={canUseRealEstate}
              href="/dashboard"
            />

            <AccessCard
              title="Trading Intelligence"
              description="Market opportunities, watchlists, asset research, alerts, Daily Briefs, and portfolio insights."
              enabled={canUseTrading}
              href="/trading"
            />
          </div>
        </section>

        <section className="rounded-[40px] border border-white/10 bg-white/[0.05] p-7 backdrop-blur-2xl md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/30">
                Need help?
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-[-0.045em]">
                Subscription or access issue?
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/42">
                Confirm that you are signed into the same
                Nestrova account used during checkout. PayPal
                subscription updates may require a brief refresh
                before access is displayed.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/pricing"
                className="rounded-full border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
              >
                Review pricing
              </Link>

              <Link
                href="/"
                className="rounded-full bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-neutral-200"
              >
                Return home
              </Link>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-4 border-t border-white/10 py-8 text-xs text-white/28 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 Nestrova. Account and billing management.
          </p>

          <div className="flex flex-wrap gap-5">
            <Link
              href="/terms"
              className="transition hover:text-white/60"
            >
              Terms
            </Link>

            <Link
              href="/privacy"
              className="transition hover:text-white/60"
            >
              Privacy
            </Link>

            <Link
              href="/pricing"
              className="transition hover:text-white/60"
            >
              Pricing
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}