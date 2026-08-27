'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentLocationColumns, type PaymentLocation } from '@lib/resources/payment-locations';
import { LocationsListMap } from '@lib/components/map/locations-list-map';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@lib/components/ui/tabs';
import { useTranslation } from '@lib/i18n/locale-provider';

export default function PaymentLocationListPage() {
  const { t } = useTranslation();

  return (
    <Tabs defaultValue="table">
      <TabsList className="w-fit mx-6 mt-6">
        <TabsTrigger value="table">{t('locations.tabTable')}</TabsTrigger>
        <TabsTrigger value="map">{t('locations.tabMap')}</TabsTrigger>
      </TabsList>
      <TabsContent value="table">
        <ResourceList<PaymentLocation>
          resource="payment_locations"
          columns={paymentLocationColumns}
          basePath="/locations"
          title="nav.locations"
        />
      </TabsContent>
      <TabsContent value="map" className="p-6 pt-0">
        <LocationsListMap />
      </TabsContent>
    </Tabs>
  );
}
