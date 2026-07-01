export type SavedAnalysis = {
  id: string;
  userId: string;
  address: string;
  recommendation: "BUY" | "HOLD" | "PASS";
  score: number;
  createdAt: string;
};

export type WatchlistItem = {
  id: string;
  userId: string;
  address: string;
  note?: string;
  createdAt: string;
};
