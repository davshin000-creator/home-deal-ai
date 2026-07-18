"use client";

import { useEffect, useRef } from "react";
import {
  importLibrary,
  setOptions,
} from "@googlemaps/js-api-loader";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

let loaderConfigured = false;

export default function AddressAutocomplete({
  value,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let autocomplete:
      | google.maps.places.Autocomplete
      | null = null;

    let listener:
      | google.maps.MapsEventListener
      | null = null;

    async function initAutocomplete() {
      const apiKey =
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        console.error(
          "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing.",
        );
        return;
      }

      if (!loaderConfigured) {
        setOptions({
          key: apiKey,
          v: "weekly",
        });

        loaderConfigured = true;
      }

      const placesLibrary =
        (await importLibrary(
          "places",
        )) as google.maps.PlacesLibrary;

      if (!inputRef.current) return;

      autocomplete = new placesLibrary.Autocomplete(
        inputRef.current,
        {
          componentRestrictions: {
            country: "us",
          },
          fields: ["formatted_address"],
          types: ["address"],
        },
      );

      listener = autocomplete.addListener(
        "place_changed",
        () => {
          const place = autocomplete?.getPlace();
          const formattedAddress =
            place?.formatted_address;

          if (formattedAddress) {
            onChangeRef.current(formattedAddress);
          }
        },
      );
    }

    initAutocomplete().catch((error) => {
      console.error(
        "google_places_autocomplete_failed",
        error,
      );
    });

    return () => {
      if (listener) {
        listener.remove();
      }
    };
  }, []);

  return (
    <input
      ref={inputRef}
      value={value}
      onChange={(event) =>
        onChange(event.target.value)
      }
      placeholder="Search any U.S. address..."
      autoComplete="off"
      className="h-14 w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-sm font-semibold text-white outline-none placeholder:text-white/25 focus:border-white/25"
    />
  );
}