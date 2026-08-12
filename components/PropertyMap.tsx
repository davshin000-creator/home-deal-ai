"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  importLibrary,
  setOptions,
} from "@googlemaps/js-api-loader";

type Props = {
  address: string;
  latitude?: number | null;
  longitude?: number | null;
  city?: string | null;
  state?: string | null;
};

let configured = false;

export default function PropertyMap({
  address,
  latitude,
  longitude,
  city,
  state,
}: Props) {
  const mapRef = useRef<HTMLDivElement | null>(
    null,
  );

  const streetViewRef =
    useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [mapError, setMapError] =
    useState<string | null>(null);

  const [
    streetViewAvailable,
    setStreetViewAvailable,
  ] = useState<boolean | null>(null);

  const locationLabel = useMemo(() => {
    const location = [city, state]
      .filter(Boolean)
      .join(", ");

    return location || address;
  }, [address, city, state]);

  useEffect(() => {
    if (!address) {
      return;
    }

    let cancelled = false;

    async function initLocationIntelligence() {
      setLoading(true);
      setMapError(null);
      setStreetViewAvailable(null);

      const apiKey =
        process.env
          .NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

      if (!apiKey) {
        setMapError(
          "Google Maps API key is not configured.",
        );
        setLoading(false);
        return;
      }

      if (!configured) {
        setOptions({
          key: apiKey,
          v: "weekly",
        });

        configured = true;
      }

      const mapsLibrary =
        (await importLibrary(
          "maps",
        )) as google.maps.MapsLibrary;

      const markerLibrary =
        (await importLibrary(
          "marker",
        )) as google.maps.MarkerLibrary;

      const streetViewLibrary =
        (await importLibrary(
          "streetView",
        )) as google.maps.StreetViewLibrary;

      const {
        Map,
      } = mapsLibrary;

      const {
        AdvancedMarkerElement,
      } = markerLibrary;

      const {
        StreetViewPanorama,
        StreetViewService,
      } = streetViewLibrary;

      if (
        cancelled ||
        !mapRef.current ||
        !streetViewRef.current
      ) {
        return;
      }

      let position:
        | google.maps.LatLng
        | google.maps.LatLngLiteral;

      const hasCoordinates =
        Number.isFinite(latitude) &&
        Number.isFinite(longitude);

      if (hasCoordinates) {
        position = {
          lat: Number(latitude),
          lng: Number(longitude),
        };
      } else {
        const geocodingLibrary =
          (await importLibrary(
            "geocoding",
          )) as google.maps.GeocodingLibrary;

        const { Geocoder } =
          geocodingLibrary;

        const geocoder =
          new Geocoder();

        const response =
          await geocoder.geocode({
            address,
          });

        const result =
          response.results[0];

        if (!result) {
          throw new Error(
            "No map location was found for this property.",
          );
        }

        position =
          result.geometry.location;
      }

      if (cancelled) {
        return;
      }

      const map = new Map(
        mapRef.current,
        {
          center: position,
          zoom: 17,
          mapId: "DEMO_MAP_ID",

          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,

          zoomControl: true,
          clickableIcons: true,

          gestureHandling:
            "cooperative",
        },
      );

      new AdvancedMarkerElement({
        map,
        position,
        title: address,
      });

      const streetViewService =
        new StreetViewService();

      try {
        const panoramaResult =
          await streetViewService.getPanorama(
            {
              location: position,
              radius: 120,
              source:
                google.maps
                  .StreetViewSource.OUTDOOR,
            },
          );

        if (
          cancelled ||
          !streetViewRef.current
        ) {
          return;
        }

        const panoramaLocation =
          panoramaResult.data.location;

        if (
          !panoramaLocation?.latLng
        ) {
          setStreetViewAvailable(
            false,
          );

          return;
        }

        new StreetViewPanorama(
          streetViewRef.current,
          {
            position:
              panoramaLocation.latLng,

            pov: {
              heading: 0,
              pitch: 0,
            },

            zoom: 1,

            addressControl: false,
            fullscreenControl: true,
            motionTracking: false,
            motionTrackingControl:
              false,
            linksControl: true,
            panControl: false,
            zoomControl: true,
          },
        );

        setStreetViewAvailable(true);
      } catch {
        setStreetViewAvailable(false);
      }

      setLoading(false);
    }

    initLocationIntelligence().catch(
      (error) => {
        console.error(
          "property_location_intelligence_failed",
          error,
        );

        if (!cancelled) {
          setMapError(
            error instanceof Error
              ? error.message
              : "Location intelligence could not be loaded.",
          );

          setLoading(false);
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [
    address,
    latitude,
    longitude,
  ]);

  const googleMapsHref =
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address,
    )}`;

  return (
    <section className="relative min-w-0 overflow-hidden rounded-[34px] border border-white/10 bg-[linear-gradient(145deg,rgba(255,255,255,0.055),rgba(255,255,255,0.025))] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.28)] md:p-7">
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-emerald-300/[0.07] blur-3xl" />

      <div className="relative">
        <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200/65">
              Location Intelligence
            </p>

            <h2 className="mt-3 break-words text-3xl font-black tracking-[-0.05em] [overflow-wrap:anywhere]">
              Map & Street View.
            </h2>

            <p className="mt-3 max-w-2xl break-words text-sm leading-6 text-white/38 [overflow-wrap:anywhere]">
              {address}
            </p>
          </div>

          <a
            href={googleMapsHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-[14px] border border-white/10 bg-white/[0.055] px-4 py-3 text-xs font-bold text-white/55 transition hover:border-white/20 hover:bg-white/[0.09] hover:text-white"
          >
            Open in Google Maps ↗
          </a>
        </div>

        {mapError ? (
          <div className="mt-6 rounded-[22px] border border-red-300/15 bg-red-300/[0.06] p-5 text-sm leading-6 text-red-100/70">
            {mapError}
          </div>
        ) : (
          <>
            <div className="mt-6 grid min-w-0 gap-4 xl:grid-cols-2">
              <article className="min-w-0 overflow-hidden rounded-[26px] border border-white/10 bg-black/25">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-cyan-200/55">
                      Interactive Map
                    </p>

                    <p className="mt-1 text-xs text-white/32">
                      Subject property location
                    </p>
                  </div>

                  <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(103,232,249,0.6)]" />
                </div>

                <div
                  ref={mapRef}
                  className="h-[360px] w-full bg-black/30 md:h-[430px]"
                />
              </article>

              <article className="min-w-0 overflow-hidden rounded-[26px] border border-white/10 bg-black/25">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-violet-200/55">
                      Street View
                    </p>

                    <p className="mt-1 text-xs text-white/32">
                      Nearest available road imagery
                    </p>
                  </div>

                  <span
                    className={[
                      "h-2.5 w-2.5 rounded-full",
                      streetViewAvailable ===
                      false
                        ? "bg-amber-300"
                        : "bg-violet-300 shadow-[0_0_18px_rgba(196,181,253,0.55)]",
                    ].join(" ")}
                  />
                </div>

                <div className="relative h-[360px] md:h-[430px]">
                  <div
                    ref={streetViewRef}
                    className="absolute inset-0 h-full w-full bg-black/30"
                  />

                  {streetViewAvailable ===
                  false ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.08),rgba(0,0,0,0.88))] p-8 text-center">
                      <div>
                        <p className="text-sm font-bold text-amber-100">
                          Street View unavailable
                        </p>

                        <p className="mt-2 max-w-sm text-xs leading-6 text-white/35">
                          No recent outdoor Street
                          View panorama was found
                          within 120 meters of this
                          property.
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              </article>
            </div>

            <div className="mt-4 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                  Location
                </p>

                <p className="mt-2 truncate text-sm font-bold text-white/72">
                  {locationLabel}
                </p>
              </div>

              <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                  Latitude
                </p>

                <p className="mt-2 text-sm font-bold text-white/72">
                  {Number.isFinite(latitude)
                    ? Number(
                        latitude,
                      ).toFixed(6)
                    : "Geocoded"}
                </p>
              </div>

              <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                  Longitude
                </p>

                <p className="mt-2 text-sm font-bold text-white/72">
                  {Number.isFinite(longitude)
                    ? Number(
                        longitude,
                      ).toFixed(6)
                    : "Geocoded"}
                </p>
              </div>

              <div className="rounded-[18px] border border-white/10 bg-black/20 p-4">
                <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-white/28">
                  Street View
                </p>

                <p
                  className={[
                    "mt-2 text-sm font-bold",
                    streetViewAvailable ===
                    false
                      ? "text-amber-100"
                      : "text-emerald-200",
                  ].join(" ")}
                >
                  {streetViewAvailable ===
                  false
                    ? "Unavailable"
                    : streetViewAvailable
                      ? "Available"
                      : "Checking"}
                </p>
              </div>
            </div>
          </>
        )}

        {loading && !mapError ? (
          <div className="pointer-events-none absolute inset-x-0 top-[150px] z-20 flex justify-center">
            <div className="rounded-full border border-white/10 bg-black/70 px-4 py-2 text-xs font-semibold text-white/55 backdrop-blur-xl">
              Loading location intelligence...
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
