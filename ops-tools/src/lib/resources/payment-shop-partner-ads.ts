import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentShopPartnerAd {
  id: number;
  partner_name: string;
  headline: string;
  body: string | null;
  cta_label: string | null;
  link_url: string;
  image_object_key: string | null;
  image_credit: string | null;
  image_source_url: string | null;
  placement: string;
  category: string | null;
  is_active: boolean;
  position: number;
  created_at: string | null;
  updated_at: string | null;
}

export const paymentShopPartnerAdSchema = z.object({
  partner_name: z.string().min(1).max(128),
  headline: z.string().min(1).max(160),
  body: z.string().max(600).nullable().optional(),
  cta_label: z.string().max(64).nullable().optional(),
  // ck_shop_ad_link_https
  link_url: z.string().startsWith('https://', 'Must start with https://'),
  image_object_key: z.string().nullable().optional(),
  image_credit: z.string().nullable().optional(),
  image_source_url: z.string().nullable().optional(),
  // Only `shop_product` exists today (see the payments backend's ShopPartnerAd).
  placement: z.enum(['shop_product']).default('shop_product'),
  category: z.string().nullable().optional(),
  is_active: z.boolean().default(false),
  position: z.number().int().default(0),
});

export const paymentShopPartnerAdColumns: ResourceColumn<PaymentShopPartnerAd>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'partner_name', header: 'shopPartnerAds.partnerName' },
  { key: 'headline', header: 'shopPartnerAds.headline' },
  { key: 'placement', header: 'shopPartnerAds.placement' },
  { key: 'category', header: 'shopPartnerAds.category' },
  {
    key: 'is_active',
    header: 'shopPartnerAds.active',
    render: (r, t) => (r.is_active ? t('common.yes') : t('common.no')),
  },
  { key: 'position', header: 'common.position' },
];

export const paymentShopPartnerAdFields: ResourceFormField[] = [
  { name: 'partner_name', label: 'shopPartnerAds.partnerName' },
  { name: 'headline', label: 'shopPartnerAds.headline' },
  { name: 'body', label: 'shopPartnerAds.body' },
  { name: 'cta_label', label: 'shopPartnerAds.ctaLabel' },
  { name: 'link_url', label: 'shopPartnerAds.linkUrl' },
  { name: 'image_object_key', label: 'common.objectKey' },
  { name: 'image_credit', label: 'common.imageCredit' },
  { name: 'image_source_url', label: 'common.imageSourceUrl' },
  {
    name: 'placement',
    label: 'shopPartnerAds.placement',
    type: 'select',
    options: [{ labelKey: 'shopPartnerAds.placementShopProduct', value: 'shop_product' }],
  },
  { name: 'category', label: 'shopPartnerAds.categoryLabel' },
  { name: 'is_active', label: 'shopPartnerAds.active', type: 'checkbox' },
  { name: 'position', label: 'common.position', type: 'number' },
];
