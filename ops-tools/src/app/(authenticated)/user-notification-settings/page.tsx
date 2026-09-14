'use client';

import { ResourceList, readOnlyActions } from '@lib/components/crud/resource-table';
import {
  paymentUserNotificationSettingsColumns,
  paymentUserNotificationSettingsPrimaryKey,
  type PaymentUserNotificationSettings,
} from '@lib/resources/payment-user-notification-settings';

export default function PaymentUserNotificationSettingsListPage() {
  return (
    <ResourceList<PaymentUserNotificationSettings>
      resource="payment_user_notification_settings"
      columns={paymentUserNotificationSettingsColumns}
      basePath="/user-notification-settings"
      title="nav.userNotificationSettings"
      actions={readOnlyActions}
      primaryKey={paymentUserNotificationSettingsPrimaryKey}
    />
  );
}
