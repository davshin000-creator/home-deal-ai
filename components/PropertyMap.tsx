"use client";

import { useEffect, useRef } from "react";
import {
  importLibrary,
  setOptions,
} from "@googlemaps/js-api-loader";

type Props = {
  address: string;
};

let configured = false;

export default function PropertyMap({
  address,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!address) return;

    async function initMap() {
      const apiKey =
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        console.error(
          "NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is missing.",
        );
        return;
      }

      if (!configured) {
        setOptions({
          key: apiKey,
          v: "weekly",
        });

        configured = true;
      }

      const { Map } =
        (await importLibrary(
          "maps",
        )) as google.maps.MapsLibrary;

      const { Geocoder } =
        (await importLibrary(
          "geocoding",
        )) as google.maps.GeocodingLibrary;

      const { AdvancedMarkerElement } =
        (await importLibrary(
          "marker",
        )) as google.maps.MarkerLibrary;

      if (!mapRef.current) return;

      const geocoder = new Geocoder();

      const response = await geocoder.geocode({
        address,
      });

      const result = response.results[0];

      if (!result) {
        console.error(
          "No map location found for:",
          address,
        );
        return;
      }

      const position =
        result.geometry.location;

      const map = new Map(mapRef.current, {
        center: position,
        zoom: 16,
        mapId: "DEMO_MAP_ID",
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      new AdvancedMarkerElement({
        map,
        position,
        title: address,
      });
    }

    initMap().catch((error) => {
      console.error(
        "property_map_failed",
        error,
      );
    });
  }, [address]);

  return (
    <div
      ref={mapRef}
      className="h-[420px] w-full overflow-hidden rounded-3xl border border-white/10"
    />
  );
}