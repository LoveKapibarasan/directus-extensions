'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentShopProductColumns, type PaymentShopProduct } from '@lib/resources/payment-shop-products';

export default function PaymentShopProductListPage() {
  return (
    <ResourceList<PaymentShopProduct>
      resource="payment_shop_products"
      columns={paymentShopProductColumns}
      basePath="/shop-products"
      title="nav.shopProducts"
    />
  );
}
