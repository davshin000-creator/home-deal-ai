"use client";

import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import AddressAutocomplete from "@/components/AddressAutocomplete";
import {
  ArrowRightIcon,
  PropertyIcon,
} from "@/components/ui/NestrovaIcons";
import {
  REAL_ESTATE_COUNTRY_CONFIG,
  type RealEstateCountryCode,
} from "@/lib/real-estate/global/country-config";

const COUNTRY_OPTIONS: RealEstateCountryCode[] = [
  "US",
  "CA",
  "KR",
];

export default function RealEstateQuickAnalyze() {
  const router = useRouter();

  const [address, setAddress] = useState("");
  const [countryCode, setCountryCode] =
    useState<RealEstateCountryCode>("US");

  const country =
    REAL_ESTATE_COUNTRY_CONFIG[countryCode];

  function handleCountryChange(
    nextCountryCode: RealEstateCountryCode,
  ) {
    const nextCountry =
      REAL_ESTATE_COUNTRY_CONFIG[
        nextCountryCode
      ];

    if (!nextCountry.enabled) {
      return;
    }

    setCountryCode(nextCountryCode);
    setAddress("");
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalized = address.trim();

    if (!normalized || !country.enabled) {
      return;
    }

    router.push(
      `/analyze?address=${encodeURIComponent(
        normalized,
      )}&country=${encodeURIComponent(
        countryCode,
      )}`,
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8"
    >
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {COUNTRY_OPTIONS.map(
          (optionCode) => {
            const option =
              REAL_ESTATE_COUNTRY_CONFIG[
                optionCode
              ];

            const selected =
              optionCode === countryCode;

            return (
              <button
                key={optionCode}
                type="button"
                disabled={!option.enabled}
                onClick={() =>
                  handleCountryChange(
                    optionCode,
                  )
                }
                className={[
                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition",
                  selected
                    ? "border-emerald-300/30 bg-emerald-300/[0.10] text-emerald-100"
                    : option.enabled
                      ? "border-white/10 bg-white/[0.04] text-white/50 hover:bg-white/[0.08] hover:text-white"
                      : "cursor-not-allowed border-white/[0.07] bg-white/[0.025] text-white/25",
                ].join(" ")}
              >
                <span>
                  {option.name}
                </span>

                {!option.enabled ? (
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-white/25">
                    Coming Soon
                  </span>
                ) : null}
              </button>
            );
          },
        )}
      </div>

      <div className="rounded-[26px] border border-white/10 bg-black/25 p-3">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="min-w-0 flex-1">
            <AddressAutocomplete
              value={address}
              onChange={setAddress}
            />
          </div>

          <button
            type="submit"
            disabled={
              !address.trim() ||
              !country.enabled
            }
            className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-[18px] bg-white px-6 text-sm font-bold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <PropertyIcon className="h-4 w-4" />
            Analyze
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs leading-5 text-white/30">
          Enter a {country.name} property
          address to start. You can add the
          listing price on the analysis page.
        </p>

        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/20">
          {country.currency}
          {" · "}
          {country.primaryAreaUnit}
        </p>
      </div>
    </form>
  );
}