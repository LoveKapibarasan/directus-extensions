import { z } from 'zod';
import type { ResourceColumn } from '@lib/components/crud/resource-table';
import type { ResourceFormField } from '@lib/components/crud/resource-form';

export interface PaymentOperator {
  id: number;
  name: string;
  stripe_account_id: string;
  account_type: string;
  user_id: number | null;
  citrineos_tenant_id: number | null;
  onboarding_state: string;
  vat_scheme: string;
  invoicing_mode: string;
  fee_charged_to: string;
  gutschrift_consent_at: string | null;
  terms_accepted_at: string | null;
  terms_version: string | null;
  privacy_accepted_at: string | null;
  privacy_version: string | null;
  legal_name: string | null;
  legal_form: string | null;
  is_trader: boolean | null;
  contact_email: string | null;
  street: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
  vat_id: string | null;
  register_name: string | null;
  register_number: string | null;
}

// A Kleinunternehmer (§19 UStG) can't sell energy directly — the DB enforces
// this with ck_operator_kleinunternehmer_not_host_sells, so the form refuses
// it up front instead of surfacing a constraint violation.
export const paymentOperatorSchema = z
  .object({
    name: z.string().min(1),
    stripe_account_id: z.string().min(1),
    account_type: z.enum(['connected', 'main']),
    user_id: z.number().nullable().optional(),
    citrineos_tenant_id: z.number().int().nullable().optional(),
    onboarding_state: z.enum(['pending', 'verified', 'suspended']).default('verified'),
    vat_scheme: z.enum(['standard', 'kleinunternehmer']).default('standard'),
    invoicing_mode: z.enum(['platform_resells', 'host_sells']).default('platform_resells'),
    fee_charged_to: z.enum(['host', 'driver']).default('host'),
    gutschrift_consent_at: z.string().nullable().optional(),
    terms_accepted_at: z.string().nullable().optional(),
    terms_version: z.string().nullable().optional(),
    privacy_accepted_at: z.string().nullable().optional(),
    privacy_version: z.string().nullable().optional(),
    legal_name: z.string().nullable().optional(),
    legal_form: z.string().nullable().optional(),
    is_trader: z.boolean().nullable().optional(),
    contact_email: z.string().nullable().optional(),
    street: z.string().nullable().optional(),
    postal_code: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    country: z.string().max(2, 'ISO 3166-1 alpha-2, e.g. DE').nullable().optional(),
    vat_id: z.string().nullable().optional(),
    register_name: z.string().nullable().optional(),
    register_number: z.string().nullable().optional(),
  })
  .refine((v) => !(v.vat_scheme === 'kleinunternehmer' && v.invoicing_mode === 'host_sells'), {
    path: ['invoicing_mode'],
    message: "A Kleinunternehmer can't use host_sells — use platform_resells.",
  });

export const paymentOperatorColumns: ResourceColumn<PaymentOperator>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'name', header: 'operators.name' },
  { key: 'account_type', header: 'operators.accountType' },
  { key: 'onboarding_state', header: 'operators.onboardingState' },
  { key: 'citrineos_tenant_id', header: 'operators.citrineosTenantId' },
  { key: 'invoicing_mode', header: 'operators.invoicingMode' },
  { key: 'stripe_account_id', header: 'operators.stripeAccountId' },
];

export const paymentOperatorFields: ResourceFormField[] = [
  { name: 'name', label: 'operators.name' },
  {
    name: 'account_type',
    label: 'operators.accountType',
    type: 'select',
    options: [
      { labelKey: 'operators.accountTypeConnected', value: 'connected' },
      { labelKey: 'operators.accountTypeMain', value: 'main' },
    ],
  },
  { name: 'stripe_account_id', label: 'operators.stripeAccountId' },
  {
    name: 'user_id',
    label: 'operators.user',
    type: 'relation',
    relation: { resource: 'payment_users', optionLabel: 'email' },
  },
  { name: 'citrineos_tenant_id', label: 'operators.citrineosTenantId', type: 'number' },
  {
    name: 'onboarding_state',
    label: 'operators.onboardingState',
    type: 'select',
    options: [
      { labelKey: 'operators.onboardingPending', value: 'pending' },
      { labelKey: 'operators.onboardingVerified', value: 'verified' },
      { labelKey: 'operators.onboardingSuspended', value: 'suspended' },
    ],
  },
  {
    name: 'vat_scheme',
    label: 'operators.vatScheme',
    type: 'select',
    options: [
      { labelKey: 'operators.vatSchemeStandard', value: 'standard' },
      { labelKey: 'operators.vatSchemeKleinunternehmer', value: 'kleinunternehmer' },
    ],
  },
  {
    name: 'invoicing_mode',
    label: 'operators.invoicingMode',
    type: 'select',
    options: [
      { labelKey: 'operators.invoicingPlatformResells', value: 'platform_resells' },
      { labelKey: 'operators.invoicingHostSells', value: 'host_sells' },
    ],
  },
  {
    name: 'fee_charged_to',
    label: 'operators.feeChargedTo',
    type: 'select',
    options: [
      { labelKey: 'operators.feeChargedToHost', value: 'host' },
      { labelKey: 'operators.feeChargedToDriver', value: 'driver' },
    ],
  },
  { name: 'legal_name', label: 'operators.legalName' },
  { name: 'legal_form', label: 'operators.legalForm' },
  { name: 'is_trader', label: 'operators.isTrader', type: 'checkbox' },
  { name: 'contact_email', label: 'operators.contactEmail' },
  { name: 'street', label: 'operators.street' },
  { name: 'postal_code', label: 'operators.postalCode' },
  { name: 'city', label: 'operators.city' },
  { name: 'country', label: 'operators.country' },
  { name: 'vat_id', label: 'operators.vatId' },
  { name: 'register_name', label: 'operators.registerName' },
  { name: 'register_number', label: 'operators.registerNumber' },
  { name: 'terms_version', label: 'operators.termsVersion' },
  { name: 'terms_accepted_at', label: 'operators.termsAcceptedAt', type: 'datetime-local' },
  { name: 'privacy_version', label: 'operators.privacyVersion' },
  { name: 'privacy_accepted_at', label: 'operators.privacyAcceptedAt', type: 'datetime-local' },
  { name: 'gutschrift_consent_at', label: 'operators.gutschriftConsentAt', type: 'datetime-local' },
];
