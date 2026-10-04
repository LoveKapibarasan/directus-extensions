// Every payment_* table in the citrineos-payment v1.4 schema (payments
// migration 0050). ensure-hasura-tracked.ts tracks exactly these in Hasura.
export const PAYMENT_TABLES = [
  'payment_charger_reviews',
  'payment_checkouts',
  'payment_connectors',
  'payment_evses',
  'payment_host_cards',
  'payment_host_invites',
  'payment_invoice_branding',
  'payment_location_photos',
  'payment_locations',
  'payment_meter_value_history',
  'payment_operator_infos',
  'payment_operators',
  'payment_point_entries',
  'payment_processed_stripe_events',
  'payment_push_devices',
  'payment_reservations',
  'payment_review_reports',
  'payment_rfid_cards',
  'payment_rfid_subscriptions',
  'payment_shop_orders',
  'payment_shop_partner_ads',
  'payment_shop_product_photos',
  'payment_shop_product_relations',
  'payment_shop_products',
  'payment_station_connection_attempts',
  'payment_station_readers',
  'payment_stations',
  'payment_subscription_plans',
  'payment_tariffs',
  'payment_user_notification_settings',
  'payment_user_security_credentials',
  'payment_users',
] as const;

export type PaymentTable = (typeof PAYMENT_TABLES)[number];

export function isPaymentTable(value: string): value is PaymentTable {
  return (PAYMENT_TABLES as readonly string[]).includes(value);
}
