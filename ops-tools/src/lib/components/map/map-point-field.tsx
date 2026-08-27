'use client';

import { Controller } from 'react-hook-form';
import { Input } from '@lib/components/ui/input';
import { MapLocationPicker } from '@lib/components/map/map-location-picker';
import { useTranslation } from '@lib/i18n/locale-provider';

interface MapPointFieldProps {
  control: any;
  latitudeField: string;
  longitudeField: string;
}

/**
 * Paired latitude/longitude editor: a click-to-pick map plus the raw number
 * inputs, kept in sync in both directions.
 */
export function MapPointField({ control, latitudeField, longitudeField }: MapPointFieldProps) {
  const { t } = useTranslation();
  return (
    <Controller
      name={latitudeField}
      control={control}
      render={({ field: latField }) => (
        <Controller
          name={longitudeField}
          control={control}
          render={({ field: lngField }) => (
            <div className="space-y-2">
              <MapLocationPicker
                latitude={latField.value ?? null}
                longitude={lngField.value ?? null}
                onChange={(lat, lng) => {
                  latField.onChange(lat);
                  lngField.onChange(lng);
                }}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  step="any"
                  placeholder={t('mapUi.latitude')}
                  value={latField.value ?? ''}
                  onChange={(e) => latField.onChange(e.target.value === '' ? null : Number(e.target.value))}
                />
                <Input
                  type="number"
                  step="any"
                  placeholder={t('mapUi.longitude')}
                  value={lngField.value ?? ''}
                  onChange={(e) => lngField.onChange(e.target.value === '' ? null : Number(e.target.value))}
                />
              </div>
            </div>
          )}
        />
      )}
    />
  );
}
