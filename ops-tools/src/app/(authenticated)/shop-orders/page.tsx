'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentShopOrderColumns, type PaymentShopOrder } from '@lib/resources/payment-shop-orders';

export default function PaymentShopOrderListPage() {
  return (
    <ResourceList<PaymentShopOrder>
      resource="payment_shop_orders"
      columns={paymentShopOrderColumns}
      basePath="/shop-orders"
      title="nav.shopOrders"
    />
  );
}
