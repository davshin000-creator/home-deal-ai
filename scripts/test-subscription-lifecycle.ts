import {
  hasActiveSubscription,
  hasFeature,
} from "../lib/subscriptions/entitlements";

const now =
  new Date("2026-08-15T22:00:00.000Z");

const future =
  "2026-08-20T22:00:00.000Z";

const past =
  "2026-08-14T22:00:00.000Z";

const cases = [
  {
    name: "FREE",
    profile: {
      subscription_type: "free",
      subscription_status: "free",
      entitlements: [],
      is_pro: false,
    },
    expected: false,
  },

  {
    name: "TRIAL ACTIVE",
    profile: {
      subscription_type: "trading",
      subscription_status: "trialing",
      entitlements: ["trading"],
      trial_ends_at: future,
      current_period_end: future,
      cancel_at_period_end: false,
      is_pro: true,
    },
    expected: true,
  },

  {
    name: "TRIAL EXPIRED",
    profile: {
      subscription_type: "trading",
      subscription_status: "trialing",
      entitlements: ["trading"],
      trial_ends_at: past,
      current_period_end: past,
      cancel_at_period_end: false,
      is_pro: true,
    },
    expected: false,
  },

  {
    name: "PAID ACTIVE",
    profile: {
      subscription_type: "trading",
      subscription_status: "active",
      entitlements: ["trading"],
      current_period_end: future,
      cancel_at_period_end: false,
      is_pro: true,
    },
    expected: true,
  },

  {
    name: "CANCELLED - PERIOD REMAINS",
    profile: {
      subscription_type: "trading",
      subscription_status: "active",
      entitlements: ["trading"],
      current_period_end: future,
      cancel_at_period_end: true,
      is_pro: true,
    },
    expected: true,
  },

  {
    name: "CANCELLED - PERIOD ENDED",
    profile: {
      subscription_type: "trading",
      subscription_status: "active",
      entitlements: ["trading"],
      current_period_end: past,
      cancel_at_period_end: true,
      is_pro: true,
    },
    expected: false,
  },

  {
    name: "SUSPENDED",
    profile: {
      subscription_type: "trading",
      subscription_status: "suspended",
      entitlements: ["trading"],
      current_period_end: future,
      cancel_at_period_end: false,
      is_pro: false,
    },
    expected: false,
  },

  {
    name: "ALL ACCESS TRIAL",
    profile: {
      subscription_type: "all_access",
      subscription_status: "trialing",
      entitlements: [
        "real_estate",
        "trading",
        "research",
      ],
      trial_ends_at: future,
      current_period_end: future,
      cancel_at_period_end: false,
      is_pro: true,
    },
    expected: true,
  },
];

let failed = 0;

console.log(
  "===== SUBSCRIPTION LIFECYCLE TEST ====="
);

for (const testCase of cases) {
  const active =
    hasActiveSubscription(
      testCase.profile,
      now,
    );

  const trading =
    hasFeature(
      testCase.profile,
      "trading",
      now,
    );

  const passed =
    active === testCase.expected &&
    trading === testCase.expected;

  if (!passed) {
    failed += 1;
  }

  console.log("");
  console.log(testCase.name);
  console.log(" active:", active);
  console.log(" trading:", trading);
  console.log(
    " expected:",
    testCase.expected,
  );
  console.log(
    " result:",
    passed ? "PASS" : "FAIL",
  );
}

console.log("");
console.log("==============================");

if (failed > 0) {
  console.error(
    `FAILED: ${failed} lifecycle test(s)`
  );

  process.exit(1);
}

console.log(
  "ALL SUBSCRIPTION LIFECYCLE TESTS PASSED"
);
