import type { ResourceColumn } from '@lib/components/crud/resource-table';

// One row per user, keyed by user_id (no `id` column). Listed read-only:
// marketing_email is the user's own consent and security_email their own
// choice — both are changed by the user in the app, not by ops.
export const paymentUserNotificationSettingsPrimaryKey = ['user_id'];

export interface PaymentUserNotificationSettings {
  user_id: number;
  security_email: boolean;
  marketing_email: boolean;
  security_checked_at: string | null;
  updated_at: string | null;
}

export const paymentUserNotificationSettingsColumns: ResourceColumn<PaymentUserNotificationSettings>[] = [
  { key: 'user_id', header: 'userNotificationSettings.userIdColumn' },
  {
    key: 'security_email',
    header: 'userNotificationSettings.securityEmail',
    render: (r, t) => (r.security_email ? t('common.yes') : t('common.no')),
  },
  {
    key: 'marketing_email',
    header: 'userNotificationSettings.marketingEmail',
    render: (r, t) => (r.marketing_email ? t('common.yes') : t('common.no')),
  },
  { key: 'security_checked_at', header: 'userNotificationSettings.securityCheckedAt' },
  { key: 'updated_at', header: 'common.updatedAt' },
];
