'use client';

import { useParams } from 'next/navigation';
import { ResourceForm } from '@lib/components/crud/resource-form';
import { paymentShopProductPhotoSchema, paymentShopProductPhotoFields } from '@lib/resources/payment-shop-product-photos';

export default function EditPaymentShopProductPhotoPage() {
  const params = useParams();
  const id = Number(params.id);

  return (
    <ResourceForm
      resource="payment_shop_product_photos"
      id={id}
      schema={paymentShopProductPhotoSchema}
      fields={paymentShopProductPhotoFields}
      basePath="/shop-product-photos"
      title="titles.shopProductPhotos.edit"
    />
  );
}
