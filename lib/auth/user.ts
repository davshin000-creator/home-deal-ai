export type AppUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  plan?: "free" | "pro" | "team" | "enterprise";
};

export function getFallbackUser(): AppUser {
  return {
    id: "demo-user",
    email: null,
    name: "Demo User",
    plan: "free",
  };
}
