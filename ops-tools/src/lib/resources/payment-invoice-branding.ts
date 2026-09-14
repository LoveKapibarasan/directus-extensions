import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

// The *_html fields are stored raw, exactly as typed — the payments backend
// sanitises them when rendering an invoice, not on write.
export interface PaymentInvoiceBranding {
  id: number;
  operator_id: number;
  logo_object_key: string | null;
  accent_color: string | null;
  header_html: string | null;
  greeting_html: string | null;
  contact_html: string | null;
  footer_html: string | null;
  created_at: string;
  updated_at: string | null;
}

export const paymentInvoiceBrandingSchema = z.object({
  operator_id: z.number(),
  logo_object_key: z.string().nullable().optional(),
  accent_color: z.string().nullable().optional(),
  header_html: z.string().nullable().optional(),
  greeting_html: z.string().nullable().optional(),
  contact_html: z.string().nullable().optional(),
  footer_html: z.string().nullable().optional(),
});

export const paymentInvoiceBrandingColumns: ResourceColumn<PaymentInvoiceBranding>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'operator_id', header: 'invoiceBranding.operatorIdColumn' },
  { key: 'accent_color', header: 'invoiceBranding.accentColor' },
  { key: 'logo_object_key', header: 'invoiceBranding.logoObjectKey' },
  { key: 'created_at', header: 'common.createdAt' },
  { key: 'updated_at', header: 'common.updatedAt' },
];

export const paymentInvoiceBrandingFields: ResourceFormField[] = [
  {
    name: 'operator_id',
    label: 'invoiceBranding.operator',
    type: 'relation',
    relation: { resource: 'payment_operators', optionLabel: 'name' },
  },
  { name: 'accent_color', label: 'invoiceBranding.accentColorLabel' },
  { name: 'logo_object_key', label: 'invoiceBranding.logoObjectKey' },
  { name: 'header_html', label: 'invoiceBranding.headerHtml' },
  { name: 'greeting_html', label: 'invoiceBranding.greetingHtml' },
  { name: 'contact_html', label: 'invoiceBranding.contactHtml' },
  { name: 'footer_html', label: 'invoiceBranding.footerHtml' },
];
