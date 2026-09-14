'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentInvoiceBrandingColumns, type PaymentInvoiceBranding } from '@lib/resources/payment-invoice-branding';

export default function PaymentInvoiceBrandingListPage() {
  return (
    <ResourceList<PaymentInvoiceBranding>
      resource="payment_invoice_branding"
      columns={paymentInvoiceBrandingColumns}
      basePath="/invoice-branding"
      title="nav.invoiceBranding"
    />
  );
}
