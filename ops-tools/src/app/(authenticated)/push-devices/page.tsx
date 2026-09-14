'use client';

import { ResourceList, readOnlyActions } from '@lib/components/crud/resource-table';
import { paymentPushDeviceColumns, type PaymentPushDevice } from '@lib/resources/payment-push-devices';

export default function PaymentPushDeviceListPage() {
  return (
    <ResourceList<PaymentPushDevice>
      resource="payment_push_devices"
      columns={paymentPushDeviceColumns}
      basePath="/push-devices"
      title="nav.pushDevices"
      actions={readOnlyActions}
    />
  );
}
