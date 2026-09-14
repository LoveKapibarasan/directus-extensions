'use client';

import { ResourceList, readOnlyActions } from '@lib/components/crud/resource-table';
import { paymentUserSecurityCredentialColumns, type PaymentUserSecurityCredential } from '@lib/resources/payment-user-security-credentials';

export default function PaymentUserSecurityCredentialListPage() {
  return (
    <ResourceList<PaymentUserSecurityCredential>
      resource="payment_user_security_credentials"
      columns={paymentUserSecurityCredentialColumns}
      basePath="/user-security-credentials"
      title="nav.userSecurityCredentials"
      actions={readOnlyActions}
    />
  );
}
