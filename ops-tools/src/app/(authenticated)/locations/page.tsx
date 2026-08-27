'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentLocationColumns, type PaymentLocation } from '@lib/resources/payment-locations';
import { LocationsListMap } from '@lib/components/map/locations-list-map';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@lib/components/ui/tabs';

export default function PaymentLocationListPage() {
  return (
    <Tabs defaultValue="table">
      <TabsList className="w-fit mx-6 mt-6">
        <TabsTrigger value="table">Table</TabsTrigger>
        <TabsTrigger value="map">Map</TabsTrigger>
      </TabsList>
      <TabsContent value="table">
        <ResourceList<PaymentLocation>
          resource="payment_locations"
          columns={paymentLocationColumns}
          basePath="/locations"
          title="Locations"
        />
      </TabsContent>
      <TabsContent value="map" className="p-6 pt-0">
        <LocationsListMap />
      </TabsContent>
    </Tabs>
  );
}
