'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import {
  paymentShopProductPhotoSchema,
  paymentShopProductPhotoFields,
} from '@lib/resources/payment-shop-product-photos';

export default function NewPaymentShopProductPhotoPage() {
  return (
    <ResourceForm
      resource="payment_shop_product_photos"
      schema={paymentShopProductPhotoSchema}
      fields={paymentShopProductPhotoFields}
      basePath="/shop-product-photos"
      title="titles.shopProductPhotos.new"
    />
  );
}
