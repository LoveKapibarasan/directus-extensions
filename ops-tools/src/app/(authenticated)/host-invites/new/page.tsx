'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import {
  paymentHostInviteSchema,
  paymentHostInviteFields,
} from '@lib/resources/payment-host-invites';

export default function NewPaymentHostInvitePage() {
  return (
    <ResourceForm
      resource="payment_host_invites"
      schema={paymentHostInviteSchema}
      fields={paymentHostInviteFields}
      basePath="/host-invites"
      title="titles.hostInvites.new"
    />
  );
}
