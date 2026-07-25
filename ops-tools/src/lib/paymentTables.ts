export const PAYMENT_TABLES = [
  'payment_checkouts',
  'payment_users',
  'payment_subscription_plans',
  'payment_rfid_subscriptions',
  'payment_rfid_cards',
  'payment_operators',
  'payment_operator_infos',
  'payment_locations',
  'payment_evses',
  'payment_connectors',
  'payment_tariffs',
  'payment_meter_value_history',
] as const;

export type PaymentTable = (typeof PAYMENT_TABLES)[number];

export function isPaymentTable(value: string): value is PaymentTable {
  return (PAYMENT_TABLES as readonly string[]).includes(value);
}
