'use client';

import { useEffect, useState } from 'react';

interface MapsConfig {
  apiKey: string | null;
  mapId: string | null;
}

// Loaded once per page from /api/maps-config and shared by every map on it —
// avoids each map component re-fetching (and re-mounting the Google Maps
// script) independently.
let cached: Promise<MapsConfig> | null = null;

function loadMapsConfig(): Promise<MapsConfig> {
  if (!cached) {
    cached = fetch('/api/maps-config')
      .then((res) => (res.ok ? res.json() : { apiKey: null, mapId: null }))
      .catch(() => ({ apiKey: null, mapId: null }));
  }
  return cached;
}

export function useMapsConfig(): MapsConfig | undefined {
  const [config, setConfig] = useState<MapsConfig | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    loadMapsConfig().then((c) => {
      if (!cancelled) setConfig(c);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return config;
}
