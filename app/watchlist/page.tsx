"use client";

import { useEffect, useState } from "react";
import { SignInButton, UserButton, useUser } from "@/components/auth/ClerkCompat";

export default function WatchlistPage() {
  const { isSignedIn, user } = useUser();
  const [items, setItems] = useState<any[]>([]);
  const [address, setAddress] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (isSignedIn && user?.id) loadWatchlist();
  }, [isSignedIn, user?.id]);

  async function loadWatchlist() {
    if (!user?.id) return;

    const response = await fetch(`/api/watchlist?user_id=${encodeURIComponent(user.id)}`);
    const data = await response.json();
    setItems(data.items || []);
  }

  async function addItem() {
    setMessage("");

    if (!isSignedIn || !user?.id) {
      setMessage("Please sign in.");
      return;
    }

    if (!address.trim()) {
      setMessage("Address is required.");
      return;
    }

    const response = await fetch("/api/watchlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        address,
        target_price: Number(targetPrice || 0),
        note,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Could not add watchlist item.");
      return;
    }

    setMessage("Added to watchlist.");
    setAddress("");
    setTargetPrice("");
    setNote("");
    await loadWatchlist();
  }

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <a href="/" className="text-sm font-semibold text-gray-600 hover:text-black">
            ??Back to Nestrova
          </a>

          {isSignedIn ? (
            <UserButton />
          ) : (
            <SignInButton mode="modal">
              <button className="rounded-lg bg-black px-4 py-2 font-semibold text-white">
                Sign In
              </button>
            </SignInButton>
          )}
        </div>

        <section className="rounded-3xl border bg-white p-8 shadow">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            AI Watchlist
          </p>
          <h1 className="mt-2 text-5xl font-bold">Track properties before you buy</h1>
          <p className="mt-4 text-lg text-gray-600">
            Add properties you want Nestrova to track. This is the foundation for
            price-change alerts and weekly AI reports.
          </p>

          <div className="mt-6 grid gap-4">
            <input
              className="rounded-lg border p-4"
              placeholder="Property address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              className="rounded-lg border p-4"
              placeholder="Target price"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
            />
            <textarea
              className="min-h-[100px] rounded-lg border p-4"
              placeholder="Notes"
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            {message && (
              <div className="rounded-lg bg-gray-100 p-4 text-gray-800">
                {message}
              </div>
            )}

            <button
              onClick={addItem}
              className="rounded-lg bg-black p-4 font-semibold text-white hover:bg-gray-800"
            >
              Add to Watchlist
            </button>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border bg-white p-8 shadow">
          <h2 className="text-3xl font-bold">My Watchlist</h2>

          <div className="mt-6 grid gap-4">
            {items.length === 0 && (
              <p className="text-gray-600">No watchlist items yet.</p>
            )}

            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border p-5">
                <h3 className="text-xl font-bold">{item.address}</h3>
                <p className="mt-1 text-gray-600">
                  Target Price: ${Number(item.target_price || 0).toLocaleString()}
                </p>
                {item.note && <p className="mt-2 text-sm text-gray-500">{item.note}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

