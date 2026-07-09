"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/components/auth/ClerkCompat";
import { trackEvent } from "@/lib/analytics";

export default function AnalyticsPreviewPage() {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const [events, setEvents] = useState<any>(null);

  async function sendTestEvent(eventName: any) {
    setMessage("");

    await trackEvent({
      userId: user?.id,
      eventName,
      properties: {
        source: "analytics-preview",
        test: true,
      },
    });

    setMessage(`Sent ${eventName}`);
    await loadEvents();
  }

  async function loadEvents() {
    const response = await fetch("/api/events");
    const data = await response.json();
    setEvents(data);
  }

  useEffect(() => {
    loadEvents();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">
          ??Back to Nestrova
        </a>

        <section className="mt-8 rounded-3xl bg-white p-8 shadow">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            Analytics Preview
          </p>

          <h1 className="mt-2 text-5xl font-bold">Event Tracking</h1>

          <p className="mt-3 text-gray-600">
            Send test events and confirm they are stored in Supabase.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {[
              "dashboard_viewed",
              "property_analyzed",
              "report_generated",
              "coach_generated",
              "upgrade_clicked",
            ].map((eventName) => (
              <button
                key={eventName}
                onClick={() => sendTestEvent(eventName)}
                className="rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
              >
                {eventName}
              </button>
            ))}
          </div>

          {message && (
            <div className="mt-6 rounded-2xl bg-gray-100 p-4 text-gray-800">
              {message}
            </div>
          )}
        </section>

        <section className="mt-8 rounded-3xl bg-white p-8 shadow">
          <h2 className="text-3xl font-bold">Event Counts</h2>
          <pre className="mt-5 overflow-auto rounded-2xl bg-gray-50 p-5 text-sm">
            {JSON.stringify(events?.counts || {}, null, 2)}
          </pre>
        </section>
      </div>
    </main>
  );
}

