'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentShopOrderSchema, paymentShopOrderFields } from '@lib/resources/payment-shop-orders';

export default function EditPaymentShopOrderPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_shop_orders"
      id={id}
      schema={paymentShopOrderSchema}
      fields={paymentShopOrderFields}
      basePath="/shop-orders"
      title="titles.shopOrders.edit"
    />
  );
}
