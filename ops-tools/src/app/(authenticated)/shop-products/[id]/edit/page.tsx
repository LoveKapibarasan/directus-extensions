'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentShopProductSchema, paymentShopProductFields } from '@lib/resources/payment-shop-products';

export default function EditPaymentShopProductPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_shop_products"
      id={id}
      schema={paymentShopProductSchema}
      fields={paymentShopProductFields}
      basePath="/shop-products"
      title="titles.shopProducts.edit"
    />
  );
}
