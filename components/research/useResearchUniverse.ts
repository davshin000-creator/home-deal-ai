"use client";

import {
  useEffect,
  useState,
} from "react";

import type {
  ResearchSearchAsset,
} from "@/components/research/ResearchSymbolSearch";

type UniverseResponse = {
  ok?: boolean;
  assets?: ResearchSearchAsset[];
  count?: number;
};

export function useResearchUniverse() {
  const [
    assets,
    setAssets,
  ] =
    useState<ResearchSearchAsset[]>([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response =
          await fetch(
            "/api/research/universe",
            {
              cache: "no-store",
            },
          );

        const data =
          (await response.json()) as UniverseResponse;

        if (
          !cancelled &&
          response.ok &&
          Array.isArray(data.assets)
        ) {
          setAssets(data.assets);
        }
      } catch (error) {
        console.error(
          "research_universe_load_failed",
          error,
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    assets,
    loading,
    count: assets.length,
  };
}
