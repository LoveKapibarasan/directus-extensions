'use client';

import { ResourceForm } from '@lib/components/crud/resource-form';
import {
  paymentShopProductRelationSchema,
  paymentShopProductRelationFields,
  paymentShopProductRelationPrimaryKey,
} from '@lib/resources/payment-shop-product-relations';

export default function NewPaymentShopProductRelationPage() {
  return (
    <ResourceForm
      resource="payment_shop_product_relations"
      schema={paymentShopProductRelationSchema}
      fields={paymentShopProductRelationFields}
      basePath="/shop-product-relations"
      title="titles.shopProductRelations.new"
      primaryKey={paymentShopProductRelationPrimaryKey}
    />
  );
}
