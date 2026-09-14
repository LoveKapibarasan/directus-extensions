'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentHostInviteSchema, paymentHostInviteFields } from '@lib/resources/payment-host-invites';

export default function EditPaymentHostInvitePage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_host_invites"
      id={id}
      schema={paymentHostInviteSchema}
      fields={paymentHostInviteFields}
      basePath="/host-invites"
      title="titles.hostInvites.edit"
    />
  );
}
