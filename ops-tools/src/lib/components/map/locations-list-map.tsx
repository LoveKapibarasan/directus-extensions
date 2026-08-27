'use client';

import { useRouter } from 'next/navigation';
import { useList } from '@refinedev/core';
import { APIProvider, AdvancedMarker, Map, Pin } from '@vis.gl/react-google-maps';
import { useMapsConfig } from '@lib/components/map/use-maps-config';
import { defaultLatitude, defaultLongitude } from '@lib/components/map/map-location-picker';
import type { PaymentLocation } from '@lib/resources/payment-locations';
import { useTranslation } from '@lib/i18n/locale-provider';

const defaultZoom = 5;

export function LocationsListMap() {
  const router = useRouter();
  const config = useMapsConfig();
  const { t } = useTranslation();
  const { result, query } = useList<PaymentLocation>({
    resource: 'payment_locations',
    pagination: { pageSize: 1000 },
    meta: { fields: ['id', 'name', 'city', 'country', 'latitude', 'longitude'] },
  });

  const locations = (result.data ?? []).filter(
    (l): l is PaymentLocation & { latitude: number; longitude: number } =>
      l.latitude != null && l.longitude != null,
  );

  if (query.isLoading || config === undefined) {
    return <div className="h-[70vh] w-full rounded-md border bg-muted animate-pulse" />;
  }

  if (!config.apiKey) {
    return (
      <div className="h-[70vh] w-full rounded-md border flex items-center justify-center text-sm text-muted-foreground">
        {t('mapUi.notConfiguredList')}
      </div>
    );
  }

  const first = locations[0];

  return (
    <div className="h-[70vh] w-full rounded-md border overflow-hidden">
      <APIProvider apiKey={config.apiKey}>
        <Map
          mapId={config.mapId ?? undefined}
          defaultCenter={
            first ? { lat: first.latitude, lng: first.longitude } : { lat: defaultLatitude, lng: defaultLongitude }
          }
          defaultZoom={first ? 6 : defaultZoom}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          {locations.map((location) => (
            <AdvancedMarker
              key={location.id}
              position={{ lat: location.latitude, lng: location.longitude }}
              title={location.name ?? undefined}
              onClick={() => router.push(`/locations/${location.id}/edit`)}
            >
              <Pin background="var(--primary)" borderColor="white" glyphColor="white" />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
