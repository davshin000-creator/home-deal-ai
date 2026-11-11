"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

type Props = {
  location: string;
  selectedAddress?: string | null;
};

let loaderConfigured = false;

export default function RealEstateAreaMapV9({
  location,
  selectedAddress,
}: Props) {
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const target = selectedAddress || location;

  const externalUrl = useMemo(
    () =>
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        target
      )}`,
    [target]
  );

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | undefined;
    let listener: google.maps.MapsEventListener | undefined;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    setStatus("loading");

    if (!apiKey) {
      setStatus("error");
      return;
    }

    async function initialize() {
      try {
        if (!loaderConfigured) {
          setOptions({ key: apiKey!, v: "weekly" });
          loaderConfigured = true;
        }

        const mapsLibrary =
          (await importLibrary("maps")) as google.maps.MapsLibrary;

        const geocodingLibrary =
          (await importLibrary("geocoding")) as google.maps.GeocodingLibrary;

        const { Geocoder } = geocodingLibrary;
        const geocoder = new Geocoder();

        // NESTROVA_V9E17_US_OVERVIEW
        // Show the US before search; geocode only a selected location.
        const geo = target.trim()
          ? await geocoder.geocode({ address: target })
          : null;
        const position = target.trim()
          ? geo?.results[0]?.geometry.location
          : { lat: 39.8283, lng: -98.5795 };

        if (!position) {
          throw new Error("Location could not be resolved.");
        }

        if (cancelled || !nodeRef.current) return;

        const map = new mapsLibrary.Map(nodeRef.current, {
          center: position,
          zoom: selectedAddress ? 15 : target.trim() ? 11 : 4,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          zoomControl: true,
          clickableIcons: false,
          gestureHandling: "cooperative",
        });

        if (selectedAddress) {
          new google.maps.Marker({
            map,
            position,
            title: selectedAddress,
          });
        }

        timeoutId = window.setTimeout(() => {
          if (!cancelled) setStatus("error");
        }, 15000);

        listener = map.addListener("tilesloaded", () => {
          if (cancelled) return;
          if (timeoutId !== undefined) {
            window.clearTimeout(timeoutId);
          }
          setStatus("ready");
        });
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void initialize();

    return () => {
      cancelled = true;
      listener?.remove();
      if (timeoutId !== undefined) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [target, selectedAddress]);

  return (
    <section className="overflow-hidden rounded-[22px] border border-white/10 bg-[#121d29]">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">Location</p>
          <p className="mt-1 truncate text-xs text-slate-400">{target || "United States overview"}</p>
        </div>
        {target.trim() ? (
        <a
          href={externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-medium text-[#79dbcd] hover:text-white"
        >
          Open in Maps ↗
        </a>
        ) : null}
      </div>

      <div className="relative h-[340px] bg-[#1c2935] sm:h-[420px]">
        <div
          ref={nodeRef}
          role="img"
          aria-label={`Interactive Google map of ${target || "United States"}`}
          className="h-full w-full"
        />

        {status !== "ready" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#17232f]/95 px-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#69cfbf]/10 text-2xl text-[#7cdbce]">
              ◇
            </span>
            <p className="text-sm font-semibold text-white">
              {status === "loading"
                ? (target.trim() ? "Loading neighborhood map" : "Loading US map")
                : "Map preview is unavailable"}
            </p>
            <p className="max-w-xs text-xs leading-6 text-slate-400">
              {status === "loading"
                ? (target.trim() ? "Finding the selected area." : "Preparing the US overview.")
                : "Check Maps API permissions or explore this location in Google Maps."}
            </p>
            {status === "error" && Boolean(target.trim()) && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl bg-white px-4 py-2 text-xs font-semibold text-[#111c27]"
              >
                View location in Google Maps
              </a>
            )}
          </div>
        )}
      </div>

      <p className="px-5 py-3 text-[11px] leading-5 text-slate-400">
        Geographic context. Map locations do not establish verified listings.
      </p>
    </section>
  );
}