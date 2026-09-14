'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentShopPartnerAdSchema, paymentShopPartnerAdFields } from '@lib/resources/payment-shop-partner-ads';

export default function EditPaymentShopPartnerAdPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_shop_partner_ads"
      id={id}
      schema={paymentShopPartnerAdSchema}
      fields={paymentShopPartnerAdFields}
      basePath="/shop-partner-ads"
      title="titles.shopPartnerAds.edit"
    />
  );
}
