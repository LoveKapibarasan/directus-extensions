'use client';

import type { MapMouseEvent } from '@vis.gl/react-google-maps';
import { AdvancedMarker, APIProvider, Map, Pin } from '@vis.gl/react-google-maps';
import { useMapsConfig } from '@lib/components/map/use-maps-config';
import { useTranslation } from '@lib/i18n/locale-provider';

export const defaultLatitude = 51.1657; // Germany, centered — AI-Charge's home market
export const defaultLongitude = 10.4515;
const defaultZoom = 5;
const pointZoom = 15;

export interface MapLocationPickerProps {
  latitude: number | null;
  longitude: number | null;
  onChange: (latitude: number, longitude: number) => void;
}

/**
 * Click-to-pick location map, mirroring citrineos-operator-ui's
 * MapLocationPicker. Renders a marker at the given point (if set) and
 * reports the clicked lat/lng back via onChange.
 */
export function MapLocationPicker({ latitude, longitude, onChange }: MapLocationPickerProps) {
  const config = useMapsConfig();
  const { t } = useTranslation();
  const hasPoint = latitude != null && longitude != null;

  const handleClick = (e: MapMouseEvent) => {
    if (e.detail.latLng) {
      onChange(e.detail.latLng.lat, e.detail.latLng.lng);
    }
  };

  if (config === undefined) {
    return <div className="h-64 w-full rounded-md border bg-muted animate-pulse" />;
  }

  if (!config.apiKey) {
    return (
      <div className="h-64 w-full rounded-md border bg-muted flex items-center justify-center text-sm text-muted-foreground p-4 text-center">
        {t('mapUi.notConfiguredPicker')}
      </div>
    );
  }

  return (
    <div className="h-64 w-full rounded-md border overflow-hidden">
      <APIProvider apiKey={config.apiKey}>
        <Map
          mapId={config.mapId ?? undefined}
          defaultCenter={
            hasPoint ? { lat: latitude, lng: longitude } : { lat: defaultLatitude, lng: defaultLongitude }
          }
          center={hasPoint ? { lat: latitude, lng: longitude } : undefined}
          defaultZoom={hasPoint ? pointZoom : defaultZoom}
          onClick={handleClick}
          gestureHandling="cooperative"
          disableDefaultUI={false}
          zoomControl={true}
          fullscreenControl={false}
        >
          {hasPoint && (
            <AdvancedMarker position={{ lat: latitude, lng: longitude }}>
              <Pin background="var(--primary)" borderColor="white" glyphColor="white" />
            </AdvancedMarker>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
