'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentShopPartnerAdColumns, type PaymentShopPartnerAd } from '@lib/resources/payment-shop-partner-ads';

export default function PaymentShopPartnerAdListPage() {
  return (
    <ResourceList<PaymentShopPartnerAd>
      resource="payment_shop_partner_ads"
      columns={paymentShopPartnerAdColumns}
      basePath="/shop-partner-ads"
      title="nav.shopPartnerAds"
    />
  );
}
