'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import {
  paymentShopProductSchema,
  paymentShopProductFields,
} from '@lib/resources/payment-shop-products';

export default function NewPaymentShopProductPage() {
  return (
    <ResourceForm
      resource="payment_shop_products"
      schema={paymentShopProductSchema}
      fields={paymentShopProductFields}
      basePath="/shop-products"
      title="titles.shopProducts.new"
    />
  );
}
