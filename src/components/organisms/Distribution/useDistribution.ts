"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { COUNTRIES } from "@/data/countries";

export interface PublicDistributor {
  id: number;
  countryCode: string;
  countryName: string;
  url: string;
  name: string | null;
}

interface State {
  loading: boolean;
  failed: boolean;
  distributors: PublicDistributor[];
  /** Country we resolved from the visitor's IP, before any manual override. */
  detectedCountry: string | null;
}

const INITIAL: State = {
  loading: true,
  failed: false,
  distributors: [],
  detectedCountry: null,
};

/**
 * The distributor list and the visitor's country are fetched once per page and
 * cached for the tab, so opening the modal a second time is instant.
 */
let cache: Promise<Omit<State, "loading">> | null = null;

async function load(): Promise<Omit<State, "loading">> {
  const [listRes, geoRes] = await Promise.allSettled([
    fetch("/api/distributors"),
    fetch("/api/geo"),
  ]);

  let distributors: PublicDistributor[] = [];
  let failed = false;

  if (listRes.status === "fulfilled" && listRes.value.ok) {
    distributors = await listRes.value.json();
  } else {
    failed = true;
  }

  let detectedCountry: string | null = null;
  if (geoRes.status === "fulfilled" && geoRes.value.ok) {
    const geo = await geoRes.value.json();
    detectedCountry = geo.country ?? null;
  }

  // Behind a proxy that strips geo headers the IP lookup comes back empty. The
  // browser's own timezone is a good enough second guess to preselect with.
  if (!detectedCountry) detectedCountry = guessFromTimezone();

  return { failed, distributors, detectedCountry };
}

function guessFromTimezone(): string | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const zones: Record<string, string> = {
      "Asia/Tbilisi": "GE",
      "Europe/Berlin": "DE",
      "Europe/London": "GB",
      "Europe/Paris": "FR",
      "Europe/Rome": "IT",
      "Europe/Brussels": "BE",
      "Europe/Copenhagen": "DK",
      "Asia/Tokyo": "JP",
      "Australia/Sydney": "AU",
      "Australia/Melbourne": "AU",
    };
    return zones[tz] ?? null;
  } catch {
    return null;
  }
}

export type DistributionStatus = "loading" | "available" | "unavailable" | "unknown";

export function useDistribution(enabled = true) {
  const [state, setState] = useState<State>(INITIAL);
  const [override, setOverride] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    let active = true;

    if (!cache) cache = load();
    cache
      .then((result) => {
        if (active) setState({ ...result, loading: false });
      })
      .catch(() => {
        if (active) setState({ ...INITIAL, loading: false, failed: true });
      });

    return () => {
      active = false;
    };
  }, [enabled]);

  const country = override ?? state.detectedCountry;

  const distributor = useMemo(
    () =>
      country
        ? (state.distributors.find((d) => d.countryCode === country) ?? null)
        : null,
    [country, state.distributors],
  );

  const status: DistributionStatus = state.loading
    ? "loading"
    : !country
      ? "unknown"
      : distributor
        ? "available"
        : "unavailable";

  /**
   * Countries we actually ship to float to the top of the picker — that is the
   * list a visitor is most likely hunting for.
   */
  const countryOptions = useMemo(() => {
    const covered = new Set(state.distributors.map((d) => d.countryCode));
    const served = COUNTRIES.filter((c) => covered.has(c.code));
    const rest = COUNTRIES.filter((c) => !covered.has(c.code));
    return { served, rest };
  }, [state.distributors]);

  const selectCountry = useCallback((code: string) => {
    setOverride(code || null);
  }, []);

  return {
    status,
    country,
    detectedCountry: state.detectedCountry,
    isOverridden: override !== null && override !== state.detectedCountry,
    distributor,
    distributors: state.distributors,
    countryOptions,
    selectCountry,
    failed: state.failed,
  };
}
