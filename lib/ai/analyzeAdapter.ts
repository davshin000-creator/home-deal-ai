import { normalizeAnalyzeOutput } from "./propertyNormalizer";

export type AnalyzeDecisionRequest = {
  address: string;
  city?: string;
  state?: string;
};

export async function callAnalyzeApi(input: AnalyzeDecisionRequest) {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    "http://localhost:3000";

  const response = await fetch(`${baseUrl}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Analyze API failed.");
  }

  return response.json();
}

export function extractAnalyzePayload(raw: any) {
  return raw?.result || raw?.analysis || raw?.property || raw;
}

export async function analyzeToDecisionInput(input: AnalyzeDecisionRequest) {
  const raw = await callAnalyzeApi(input);
  const payload = extractAnalyzePayload(raw);

  return {
    raw,
    decisionInput: normalizeAnalyzeOutput(
      {
        ...payload,
        address: payload?.address || input.address,
        city: payload?.city || input.city,
        state: payload?.state || input.state,
      },
      input.address
    ),
  };
}
