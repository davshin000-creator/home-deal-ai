"use client";

export type BrainMemoryItem = {
  id: string;
  address: string;
  action: "BUY" | "NEGOTIATE" | "WAIT" | "SKIP";
  brainScore: number;
  confidence: number;
  headline: string;
  summary: string;
  createdAt: string;
};

const STORAGE_KEY = "nestrova-brain-memory-v1";

export function readBrainMemory(): BrainMemoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveBrainMemory(item: Omit<BrainMemoryItem, "id" | "createdAt">) {
  if (typeof window === "undefined") return null;
  const nextItem: BrainMemoryItem = {
    ...item,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const updated = [nextItem, ...readBrainMemory()].slice(0, 25);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return nextItem;
}

export function clearBrainMemory() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
