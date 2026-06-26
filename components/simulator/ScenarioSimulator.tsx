"use client";

import { useMemo, useState } from "react";
import MetricCard from "./MetricCard";
import {
  ScenarioInput,
  calculateScenario,
  formatMoney,
  formatPercent,
} from "@/lib/finance";

function NumberInput({
  label,
  value,
  setValue,
  suffix,
}: {
  label: string;
  value: number;
  setValue: (value: number) => void;
  suffix?: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="font-semibold text-gray-700">{label}</span>
      <div className="flex items-center rounded-xl border bg-white px-4">
        <input
          className="w-full bg-transparent py-4 outline-none"
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        {suffix && <span className="text-sm font-semibold text-gray-500">{suffix}</span>}
      </div>
    </label>
  );
}

export default function ScenarioSimulator() {
  const [input, setInput] = useState<ScenarioInput>({
    purchasePrice: 850000,
    downPaymentPercent: 25,
    interestRate: 6.75,
    loanYears: 30,
    monthlyRent: 4800,
    propertyTaxAnnual: 9800,
    insuranceAnnual: 2400,
    hoaMonthly: 250,
    vacancyPercent: 5,
    maintenancePercent: 5,
    managementPercent: 8,
    closingCostPercent: 3,
  });

  function update<K extends keyof ScenarioInput>(key: K, value: ScenarioInput[K]) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  const result = useMemo(() => calculateScenario(input), [input]);

  const verdict =
    result.monthlyCashFlow > 500
      ? "Strong cash-flow scenario"
      : result.monthlyCashFlow >= 0
      ? "Break-even to positive scenario"
      : "Negative cash-flow scenario";

  return (
    <section className="grid gap-8 lg:grid-cols-[430px_1fr]">
      <div className="rounded-3xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
          Scenario Inputs
        </p>
        <h2 className="mt-1 text-3xl font-bold">Investment assumptions</h2>

        <div className="mt-6 grid gap-4">
          <NumberInput label="Purchase Price" value={input.purchasePrice} setValue={(value) => update("purchasePrice", value)} />
          <NumberInput label="Down Payment" value={input.downPaymentPercent} setValue={(value) => update("downPaymentPercent", value)} suffix="%" />
          <NumberInput label="Interest Rate" value={input.interestRate} setValue={(value) => update("interestRate", value)} suffix="%" />
          <NumberInput label="Loan Years" value={input.loanYears} setValue={(value) => update("loanYears", value)} />
          <NumberInput label="Monthly Rent" value={input.monthlyRent} setValue={(value) => update("monthlyRent", value)} />
          <NumberInput label="Annual Property Tax" value={input.propertyTaxAnnual} setValue={(value) => update("propertyTaxAnnual", value)} />
          <NumberInput label="Annual Insurance" value={input.insuranceAnnual} setValue={(value) => update("insuranceAnnual", value)} />
          <NumberInput label="Monthly HOA" value={input.hoaMonthly} setValue={(value) => update("hoaMonthly", value)} />
          <NumberInput label="Vacancy" value={input.vacancyPercent} setValue={(value) => update("vacancyPercent", value)} suffix="%" />
          <NumberInput label="Maintenance" value={input.maintenancePercent} setValue={(value) => update("maintenancePercent", value)} suffix="%" />
          <NumberInput label="Management" value={input.managementPercent} setValue={(value) => update("managementPercent", value)} suffix="%" />
          <NumberInput label="Closing Costs" value={input.closingCostPercent} setValue={(value) => update("closingCostPercent", value)} suffix="%" />
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-3xl border-2 border-black bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            AI Scenario Verdict
          </p>
          <h2 className="mt-2 text-4xl font-bold">{verdict}</h2>
          <p className="mt-3 text-gray-600">
            This calculator is for informational analysis only. Verify financing,
            taxes, insurance, HOA, rent comps, vacancy, and repairs before making decisions.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Monthly Cash Flow" value={formatMoney(result.monthlyCashFlow)} sub="Rent minus monthly expenses" />
          <MetricCard label="Cash-on-Cash ROI" value={formatPercent(result.cashOnCashReturn)} sub="Annual cash flow / cash needed" />
          <MetricCard label="Cap Rate" value={formatPercent(result.capRate)} sub="NOI / purchase price" />
          <MetricCard label="Monthly Mortgage" value={formatMoney(result.monthlyMortgage)} sub={`${input.loanYears}-year loan`} />
          <MetricCard label="Cash Needed" value={formatMoney(result.cashNeeded)} sub="Down payment + closing costs" />
          <MetricCard label="Gross Yield" value={formatPercent(result.grossYield)} sub="Annual rent / purchase price" />
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h3 className="text-2xl font-bold">Monthly Expense Breakdown</h3>

          <div className="mt-5 grid gap-3">
            {[
              ["Mortgage", result.monthlyMortgage],
              ["Property Tax", result.monthlyTax],
              ["Insurance", result.monthlyInsurance],
              ["HOA", input.hoaMonthly],
              ["Vacancy", result.monthlyVacancy],
              ["Maintenance", result.monthlyMaintenance],
              ["Management", result.monthlyManagement],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex items-center justify-between rounded-2xl bg-gray-50 p-4">
                <span className="font-semibold">{String(label)}</span>
                <span className="font-bold">{formatMoney(Number(value))}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border bg-black p-6 text-white shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-gray-300">
            Pro Workflow
          </p>
          <h3 className="mt-1 text-3xl font-bold">Next: Generate AI Offer Strategy</h3>
          <p className="mt-3 text-gray-300">
            Use this scenario to create an offer strategy, AI report, and portfolio forecast.
          </p>
          <a href="/pricing" className="mt-6 inline-block rounded-xl bg-white px-6 py-4 font-semibold text-black hover:bg-gray-100">
            View Pro Features
          </a>
        </div>
      </div>
    </section>
  );
}
