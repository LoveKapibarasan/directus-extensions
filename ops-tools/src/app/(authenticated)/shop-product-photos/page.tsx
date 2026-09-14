'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import { paymentShopProductPhotoColumns, type PaymentShopProductPhoto } from '@lib/resources/payment-shop-product-photos';

export default function PaymentShopProductPhotoListPage() {
  return (
    <ResourceList<PaymentShopProductPhoto>
      resource="payment_shop_product_photos"
      columns={paymentShopProductPhotoColumns}
      basePath="/shop-product-photos"
      title="nav.shopProductPhotos"
    />
  );
}
