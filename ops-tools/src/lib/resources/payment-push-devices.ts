import type { ResourceColumn } from '@lib/components/crud/resource-table';

// Read-only. token (the Web Push endpoint / FCM registration token) and the
// Web Push keys p256dh/auth are never fetched or shown — together they're
// enough to send notifications to that device.
export interface PaymentPushDevice {
  id: number;
  channel: string;
  platform: string;
  locale: string;
  user_id: number | null;
  checkout_id: number | null;
  created_at: string;
  last_notified_at: string | null;
}

export const paymentPushDeviceColumns: ResourceColumn<PaymentPushDevice>[] = [
  { key: 'id', header: 'common.id' },
  { key: 'channel', header: 'pushDevices.channel' },
  { key: 'platform', header: 'pushDevices.platform' },
  { key: 'locale', header: 'pushDevices.locale' },
  { key: 'user_id', header: 'pushDevices.userIdColumn' },
  { key: 'checkout_id', header: 'pushDevices.checkoutIdColumn' },
  { key: 'created_at', header: 'common.createdAt' },
  { key: 'last_notified_at', header: 'pushDevices.lastNotifiedAt' },
];
