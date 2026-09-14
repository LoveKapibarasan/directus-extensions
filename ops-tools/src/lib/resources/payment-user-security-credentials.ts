import type { ResourceColumn } from '@lib/components/crud/resource-table';

// A snapshot of the second factors/passkeys a user held in Keycloak the last
// time the payments backend compared them. Read-only; Keycloak's own
// credential_id is left out — it identifies the credential in Keycloak and
// isn't needed here.
export interface PaymentUserSecurityCredential {
  id: number;
  user_id: number;
  type: string;
  label: string | null;
}

export const paymentUserSecurityCredentialColumns: ResourceColumn<PaymentUserSecurityCredential>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'user_id', header: 'userSecurityCredentials.userIdColumn' },
  { key: 'type', header: 'userSecurityCredentials.type' },
  { key: 'label', header: 'userSecurityCredentials.label' },
];
