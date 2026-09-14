'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentHostInviteColumns, type PaymentHostInvite } from '@lib/resources/payment-host-invites';

export default function PaymentHostInviteListPage() {
  return (
    <ResourceList<PaymentHostInvite>
      resource="payment_host_invites"
      columns={paymentHostInviteColumns}
      basePath="/host-invites"
      title="nav.hostInvites"
    />
  );
}
