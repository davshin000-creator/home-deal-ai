import fs from "node:fs";

function loadEnvFile(path) {
  if (!fs.existsSync(path)) {
    throw new Error(`${path} not found.`);
  }

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

if (!clientId || !clientSecret) {
  throw new Error("Missing PayPal Client ID or Client Secret.");
}

if (paypalEnv !== "live") {
  throw new Error(
    `PAYPAL_ENV must be "live". Current value: ${paypalEnv || "missing"}`
  );
}

const baseUrl = "https://api-m.paypal.com";

async function paypalFetch(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, options);
  const text = await response.text();

  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    console.error("PayPal API error:", {
      status: response.status,
      path,
      data,
    });

    throw new Error(`PayPal request failed with status ${response.status}.`);
  }

  return data;
}

const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

const tokenData = await paypalFetch("/v1/oauth2/token", {
  method: "POST",
  headers: {
    Authorization: `Basic ${auth}`,
    "Content-Type": "application/x-www-form-urlencoded",
  },
  body: "grant_type=client_credentials",
});

const accessToken = tokenData.access_token;

if (!accessToken) {
  throw new Error("PayPal access token was not returned.");
}

const product = await paypalFetch("/v1/catalogs/products", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "PayPal-Request-Id": `nestrova-product-${Date.now()}`,
  },
  body: JSON.stringify({
    name: "Nestrova Pro",
    description:
      "AI-powered real estate analysis, Brain Console, deal comparison, Ask AI, and investor-ready reports.",
    type: "SERVICE",
    category: "SOFTWARE",
  }),
});

console.log("Product created:");
console.log("PRODUCT_ID =", product.id);

const plan = await paypalFetch("/v1/billing/plans", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    "PayPal-Request-Id": `nestrova-plan-${Date.now()}`,
  },
  body: JSON.stringify({
    product_id: product.id,
    name: "Nestrova Pro Monthly - 5 Day Free Trial",
    description:
      "5-day free trial, then $19 USD per month until canceled.",
    status: "ACTIVE",
    billing_cycles: [
      {
        frequency: {
          interval_unit: "DAY",
          interval_count: 5,
        },
        tenure_type: "TRIAL",
        sequence: 1,
        total_cycles: 1,
        pricing_scheme: {
          fixed_price: {
            value: "0",
            currency_code: "USD",
          },
        },
      },
      {
        frequency: {
          interval_unit: "MONTH",
          interval_count: 1,
        },
        tenure_type: "REGULAR",
        sequence: 2,
        total_cycles: 0,
        pricing_scheme: {
          fixed_price: {
            value: "19.00",
            currency_code: "USD",
          },
        },
      },
    ],
    payment_preferences: {
      auto_bill_outstanding: true,
      setup_fee: {
        value: "0",
        currency_code: "USD",
      },
      setup_fee_failure_action: "CONTINUE",
      payment_failure_threshold: 1,
    },
    taxes: {
      percentage: "0",
      inclusive: false,
    },
  }),
});

console.log("");
console.log("Plan created:");
console.log("PLAN_ID =", plan.id);
console.log("STATUS =", plan.status);
console.log("");
console.log("Save the PRODUCT_ID and PLAN_ID shown above.");
