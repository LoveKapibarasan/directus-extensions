'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentShopOrderSchema, paymentShopOrderFields } from '@lib/resources/payment-shop-orders';

export default function NewPaymentShopOrderPage() {
  return (
    <ResourceForm
      resource="payment_shop_orders"
      schema={paymentShopOrderSchema}
      fields={paymentShopOrderFields}
      basePath="/shop-orders"
      title="titles.shopOrders.new"
    />
  );
}
