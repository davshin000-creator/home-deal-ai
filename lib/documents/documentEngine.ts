export type OfferDocumentInput = {
  propertyAddress: string;
  listingPrice: number;
  fairValue: number;
  recommendedOffer: number;
  maxOffer: number;
  walkAwayPrice: number;
  offerStrength: number;
  confidence: number;
  leverage: string;
  strategy: string;
  talkingPoints: string[];
  concessions: string[];
  inspectionFocus: string[];
  risks: string[];
};

export function formatMoney(value: number) {
  return `$${Math.round(value || 0).toLocaleString()}`;
}

export function createAgentEmail(input: OfferDocumentInput) {
  return `Subject: Purchase Offer for ${input.propertyAddress}

Hello,

Thank you for the opportunity to review ${input.propertyAddress}.

After reviewing the listing price, estimated fair value, market conditions, and investment assumptions, we would like to submit an offer of ${formatMoney(input.recommendedOffer)}.

Offer summary:
- Offer price: ${formatMoney(input.recommendedOffer)}
- Estimated fair value reviewed: ${formatMoney(input.fairValue)}
- Offer strength: ${input.offerStrength}/100
- AI confidence: ${input.confidence}%
- Negotiation leverage: ${input.leverage}

We believe this is a serious and data-supported offer while still allowing room for a smooth transaction.

Best,
`;
}

export function createPrintableHtml(input: OfferDocumentInput) {
  const email = createAgentEmail(input);
  const list = (items: string[]) => items.map((item) => `<li>${item}</li>`).join("");

  return `<!doctype html><html><head><meta charset="utf-8" />
<title>Nestrova Offer Strategy</title>
<style>
body{font-family:Arial,sans-serif;margin:40px;color:#111}.header{border-bottom:3px solid #111;padding-bottom:20px;margin-bottom:30px}.brand{font-size:14px;letter-spacing:.08em;text-transform:uppercase;color:#666}h1{font-size:36px;margin:8px 0}h2{font-size:22px;margin-top:30px}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin:20px 0}.card{border:1px solid #ddd;border-radius:14px;padding:16px}.label{color:#666;font-size:12px;text-transform:uppercase;font-weight:bold}.value{font-size:26px;font-weight:bold;margin-top:6px}pre{white-space:pre-wrap;background:#f6f6f6;padding:16px;border-radius:14px}.disclaimer{margin-top:40px;font-size:12px;color:#666;border-top:1px solid #ddd;padding-top:16px}
</style></head><body>
<div class="header"><div class="brand">Powered by Nestrova Intelligence</div><h1>AI Offer Strategy</h1><p>${input.propertyAddress}</p></div>
<div class="grid">
<div class="card"><div class="label">Recommended Offer</div><div class="value">${formatMoney(input.recommendedOffer)}</div></div>
<div class="card"><div class="label">Offer Strength</div><div class="value">${input.offerStrength}/100</div></div>
<div class="card"><div class="label">AI Confidence</div><div class="value">${input.confidence}%</div></div>
<div class="card"><div class="label">Listing Price</div><div class="value">${formatMoney(input.listingPrice)}</div></div>
<div class="card"><div class="label">Fair Value</div><div class="value">${formatMoney(input.fairValue)}</div></div>
<div class="card"><div class="label">Max Offer</div><div class="value">${formatMoney(input.maxOffer)}</div></div>
</div>
<h2>Negotiation Strategy</h2><p>${input.strategy}</p>
<h2>Talking Points</h2><ul>${list(input.talkingPoints)}</ul>
<h2>Concessions to Ask</h2><ul>${list(input.concessions)}</ul>
<h2>Inspection Focus</h2><ul>${list(input.inspectionFocus)}</ul>
<h2>Risk Summary</h2><ul>${list(input.risks)}</ul>
<h2>Agent Email Draft</h2><pre>${email}</pre>
<div class="disclaimer">This document is for informational purposes only. It is not legal, financial, tax, lending, or real estate advice.</div>
</body></html>`;
}
