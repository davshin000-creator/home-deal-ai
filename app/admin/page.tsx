"use client";

import { useEffect, useMemo, useState } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";

type AdminStats = {
  users: number;
  proUsers: number;
  waitlist: number;
  feedback: number;
  savedDeals: number;
  aiReports: number;
  coachPlans: number;
  watchlist: number;
  weeklyReports: number;
  recentFeedback: any[];
  recentUsers: any[];
  recentReports: any[];
  recentCoachPlans: any[];
};

const ADMIN_EMAILS = ["dav.shin000000@gmail.com"];

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-sm text-gray-500">{sub}</p>}
    </div>
  );
}

export default function AdminDashboardPro() {
  const { isSignedIn, user } = useUser();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const userEmail = user?.primaryEmailAddress?.emailAddress || "";
  const isAdmin = ADMIN_EMAILS.includes(userEmail);

  useEffect(() => {
    if (isSignedIn && isAdmin) loadAdminData();
  }, [isSignedIn, isAdmin]);

  async function loadAdminData() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin");
      const data = await response.json();

      if (!response.ok) {
        setMessage(data.error || "Could not load admin dashboard.");
        setLoading(false);
        return;
      }

      setStats(data);
    } catch {
      setMessage("Admin dashboard connection failed.");
    }

    setLoading(false);
  }

  const conversionRate = useMemo(() => {
    if (!stats || stats.users === 0) return "0%";
    return `${((stats.proUsers / stats.users) * 100).toFixed(1)}%`;
  }, [stats]);

  if (!isSignedIn) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow">
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="mt-3 text-gray-600">Please sign in as admin.</p>
          <SignInButton mode="modal">
            <button className="mt-6 rounded-lg bg-black px-5 py-3 font-semibold text-white">Sign In</button>
          </SignInButton>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-gray-50 p-8">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow">
          <h1 className="text-4xl font-bold">Access denied</h1>
          <p className="mt-3 text-gray-600">This page is only available to Nestrova admins.</p>
          <a href="/" className="mt-6 inline-block rounded-lg bg-black px-5 py-3 font-semibold text-white">Back to Nestrova</a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">← Back to Nestrova</a>
          <UserButton />
        </div>

        <section className="rounded-3xl border bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">Admin Dashboard Pro</p>
          <h1 className="mt-2 text-5xl font-bold tracking-tight">Nestrova Operations Center</h1>
          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            Monitor users, AI reports, coach plans, feedback, waitlist, watchlist, and product activity from one dashboard.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={loadAdminData} className="rounded-lg bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800">
              Refresh
            </button>
            <a href="/api/admin/export" className="rounded-lg border px-5 py-3 font-semibold hover:bg-gray-50">
              Export Feedback CSV
            </a>
          </div>
        </section>

        {message && <div className="mt-6 rounded-2xl bg-red-50 p-5 text-red-700">{message}</div>}
        {loading && <div className="mt-6 rounded-2xl bg-white p-6 shadow">Loading admin data...</div>}

        {stats && (
          <>
            <section className="mt-8 grid gap-4 md:grid-cols-5">
              <StatCard label="Users" value={stats.users} />
              <StatCard label="Pro Users" value={stats.proUsers} sub={`${conversionRate} conversion`} />
              <StatCard label="Waitlist" value={stats.waitlist} />
              <StatCard label="Feedback" value={stats.feedback} />
              <StatCard label="Saved Deals" value={stats.savedDeals} />
              <StatCard label="AI Reports" value={stats.aiReports} />
              <StatCard label="Coach Plans" value={stats.coachPlans} />
              <StatCard label="Watchlist" value={stats.watchlist} />
              <StatCard label="Weekly Reports" value={stats.weeklyReports} />
              <StatCard label="Revenue" value="$0" sub="Payment approval pending" />
            </section>

            <section className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow">
                <h2 className="text-2xl font-bold">Recent Feedback</h2>
                <div className="mt-5 grid gap-4">
                  {stats.recentFeedback.length === 0 && <p className="text-gray-600">No feedback yet.</p>}
                  {stats.recentFeedback.map((item) => (
                    <div key={item.id} className="rounded-2xl border p-4">
                      <p className="font-semibold">Rating: {item.rating}/5</p>
                      <p className="mt-2 text-gray-700">{item.message}</p>
                      <p className="mt-2 text-xs text-gray-500">{item.email}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow">
                <h2 className="text-2xl font-bold">Recent Users</h2>
                <div className="mt-5 grid gap-4">
                  {stats.recentUsers.length === 0 && <p className="text-gray-600">No users yet.</p>}
                  {stats.recentUsers.map((item) => (
                    <div key={item.user_id} className="rounded-2xl border p-4">
                      <p className="font-semibold">{item.email || item.user_id}</p>
                      <p className="mt-1 text-sm text-gray-600">{item.is_pro ? "Pro" : "Free"}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow">
                <h2 className="text-2xl font-bold">Recent AI Reports</h2>
                <div className="mt-5 grid gap-4">
                  {stats.recentReports.length === 0 && <p className="text-gray-600">No reports yet.</p>}
                  {stats.recentReports.map((item) => (
                    <div key={item.id} className="rounded-2xl border p-4">
                      <p className="font-semibold">{item.property_address}</p>
                      <p className="mt-1 text-sm text-gray-600">{item.is_full_report ? "Full Report" : "Preview"} · {item.investor_type}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow">
                <h2 className="text-2xl font-bold">Recent Coach Plans</h2>
                <div className="mt-5 grid gap-4">
                  {stats.recentCoachPlans.length === 0 && <p className="text-gray-600">No coach plans yet.</p>}
                  {stats.recentCoachPlans.map((item) => (
                    <div key={item.id} className="rounded-2xl border p-4">
                      <p className="font-semibold">${Number(item.budget || 0).toLocaleString()} budget</p>
                      <p className="mt-1 text-sm text-gray-600">{item.risk_level} risk · {item.time_horizon}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
