"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import AddressAutocomplete from "@/components/AddressAutocomplete";
import {
  ArrowRightIcon,
  PropertyIcon,
} from "@/components/ui/NestrovaIcons";

export default function RealEstateQuickAnalyze() {
  const router = useRouter();
  const [address, setAddress] = useState("");

  function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const normalized = address.trim();

    if (!normalized) {
      return;
    }

    router.push(
      `/analyze?address=${encodeURIComponent(
        normalized,
      )}`,
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8"
    >
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
            disabled={!address.trim()}
            className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-[18px] bg-white px-6 text-sm font-bold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <PropertyIcon className="h-4 w-4" />
            Analyze Property
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-white/30">
        Enter a U.S. property address to start.
        You can add the listing price on the
        analysis page.
      </p>
    </form>
  );
}
