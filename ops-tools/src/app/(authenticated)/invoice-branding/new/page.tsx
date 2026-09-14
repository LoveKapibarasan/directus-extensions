'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import {
  paymentInvoiceBrandingSchema,
  paymentInvoiceBrandingFields,
} from '@lib/resources/payment-invoice-branding';

export default function NewPaymentInvoiceBrandingPage() {
  return (
    <ResourceForm
      resource="payment_invoice_branding"
      schema={paymentInvoiceBrandingSchema}
      fields={paymentInvoiceBrandingFields}
      basePath="/invoice-branding"
      title="titles.invoiceBranding.new"
    />
  );
}
