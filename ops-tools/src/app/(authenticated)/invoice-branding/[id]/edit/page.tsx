'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentInvoiceBrandingSchema, paymentInvoiceBrandingFields } from '@lib/resources/payment-invoice-branding';

export default function EditPaymentInvoiceBrandingPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_invoice_branding"
      id={id}
      schema={paymentInvoiceBrandingSchema}
      fields={paymentInvoiceBrandingFields}
      basePath="/invoice-branding"
      title="titles.invoiceBranding.edit"
    />
  );
}
