import type { ResourceProps } from '@refinedev/core';

// Grouped by domain to match citrineos-operator-ui's page layout. Each
// payment_* table is its own Refine resource; entries are added here as
// each table gets its CRUD pages implemented (see the ops-tools Refine
// migration plan — this file grows one resource group per follow-up issue).
export const resources: ResourceProps[] = [
  {
    name: 'payment_tariffs',
    list: '/tariffs',
    create: '/tariffs/new',
    edit: '/tariffs/:id/edit',
    show: '/tariffs/:id',
    meta: { label: 'Tariffs', group: 'Tariffs' },
  },
];
