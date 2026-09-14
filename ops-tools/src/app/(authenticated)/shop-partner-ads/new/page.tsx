'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import {
  paymentShopPartnerAdSchema,
  paymentShopPartnerAdFields,
} from '@lib/resources/payment-shop-partner-ads';

export default function NewPaymentShopPartnerAdPage() {
  return (
    <ResourceForm
      resource="payment_shop_partner_ads"
      schema={paymentShopPartnerAdSchema}
      fields={paymentShopPartnerAdFields}
      basePath="/shop-partner-ads"
      title="titles.shopPartnerAds.new"
    />
  );
}
