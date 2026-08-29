import type { ResourceProps } from '@refinedev/core';

// Grouped by domain to match citrineos-operator-ui's page layout. Each
// payment_* table is its own Refine resource with list/create/edit routes.
export const resources: ResourceProps[] = [
  {
    name: 'payment_locations',
    list: '/locations',
    create: '/locations/new',
    edit: '/locations/:id/edit',
    meta: { label: 'Locations', group: 'Locations' },
  },
  {
    name: 'payment_evses',
    list: '/evses',
    create: '/evses/new',
    edit: '/evses/:id/edit',
    meta: { label: 'EVSEs', group: 'Locations' },
  },
  {
    name: 'payment_connectors',
    list: '/connectors',
    create: '/connectors/new',
    edit: '/connectors/:id/edit',
    meta: { label: 'Connectors', group: 'Locations' },
  },
  {
    name: 'payment_tariffs',
    list: '/tariffs',
    create: '/tariffs/new',
    edit: '/tariffs/:id/edit',
    meta: { label: 'Tariffs', group: 'Tariffs' },
  },
  {
    name: 'payment_checkouts',
    list: '/checkouts',
    create: '/checkouts/new',
    edit: '/checkouts/:id/edit',
    meta: { label: 'Checkouts', group: 'Payments' },
  },
  {
    name: 'payment_reservations',
    list: '/reservations',
    create: '/reservations/new',
    edit: '/reservations/:id/edit',
    meta: { label: 'Reservations', group: 'Payments' },
  },
  {
    name: 'payment_meter_value_history',
    list: '/meter-value-history',
    create: '/meter-value-history/new',
    edit: '/meter-value-history/:id/edit',
    meta: { label: 'Meter Value History', group: 'Payments' },
  },
  {
    name: 'payment_users',
    list: '/users',
    create: '/users/new',
    edit: '/users/:id/edit',
    meta: { label: 'Users', group: 'Users' },
  },
  {
    name: 'payment_subscription_plans',
    list: '/subscription-plans',
    create: '/subscription-plans/new',
    edit: '/subscription-plans/:id/edit',
    meta: { label: 'Plans', group: 'Subscriptions' },
  },
  {
    name: 'payment_rfid_subscriptions',
    list: '/rfid-subscriptions',
    create: '/rfid-subscriptions/new',
    edit: '/rfid-subscriptions/:id/edit',
    meta: { label: 'RFID Subscriptions', group: 'Subscriptions' },
  },
  {
    name: 'payment_rfid_cards',
    list: '/rfid-cards',
    create: '/rfid-cards/new',
    edit: '/rfid-cards/:id/edit',
    meta: { label: 'RFID Cards', group: 'Subscriptions' },
  },
  {
    name: 'payment_operators',
    list: '/operators',
    create: '/operators/new',
    edit: '/operators/:id/edit',
    meta: { label: 'Operators', group: 'Operators' },
  },
  {
    name: 'payment_operator_infos',
    list: '/operator-infos',
    create: '/operator-infos/new',
    edit: '/operator-infos/:id/edit',
    meta: { label: 'Operator Infos', group: 'Operators' },
  },
];
