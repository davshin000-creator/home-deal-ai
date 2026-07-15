import fs from "node:fs";

function loadEnvFile(path) {
  const text = fs.readFileSync(path, "utf8");

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) continue;

    const separator = line.indexOf("=");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(".env.local");

const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
const paypalEnv = process.env.PAYPAL_ENV;
const planId = process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID;

if (!clientId || !clientSecret || !planId) {
  throw new Error("Missing PayPal credentials or NEXT_PUBLIC_PAYPAL_PLAN_ID.");
}

const baseUrl =
  paypalEnv === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
  method: "POST",
  headers: {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: "grant_type=client_credentials",
});

const tokenData = await tokenResponse.json();

if (!tokenResponse.ok || !tokenData.access_token) {
  throw new Error("Unable to get PayPal access token.");
}

const planResponse = await fetch(
  `${baseUrl}/v1/billing/plans/${encodeURIComponent(planId)}`,
  {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "Content-Type": "application/json",
    },
  }
);

const plan = await planResponse.json();

if (!planResponse.ok) {
  console.error(plan);
  throw new Error("Unable to retrieve PayPal plan.");
}

console.log("PLAN_ID =", plan.id);
console.log("STATUS =", plan.status);
console.log("NAME =", plan.name);
console.log("");
console.log("BILLING_CYCLES =");
console.log(JSON.stringify(plan.billing_cycles, null, 2));
