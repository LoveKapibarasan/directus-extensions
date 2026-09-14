'use client';

import { ResourceList } from '@lib/components/crud/resource-table';
import {
  paymentShopProductRelationColumns,
  paymentShopProductRelationPrimaryKey,
  type PaymentShopProductRelation,
} from '@lib/resources/payment-shop-product-relations';

export default function PaymentShopProductRelationListPage() {
  return (
    <ResourceList<PaymentShopProductRelation>
      resource="payment_shop_product_relations"
      columns={paymentShopProductRelationColumns}
      basePath="/shop-product-relations"
      title="nav.shopProductRelations"
      primaryKey={paymentShopProductRelationPrimaryKey}
    />
  );
}
