'use client';

import Link from 'next/link';
import { useTable, useDelete, type BaseRecord } from '@refinedev/core';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@lib/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@lib/components/ui/table';
import { useTranslation } from '@lib/i18n/locale-provider';
import type { TranslationKey } from '@lib/i18n/translations';

export interface ResourceColumn<T> {
  key: string;
  header: TranslationKey;
  render?: (record: T, t: (key: TranslationKey) => string) => React.ReactNode;
}

// Which row actions a list offers. System/audit tables (e.g. processed Stripe
// events, push devices) are listed read-only; tables whose writes have side
// effects elsewhere can switch off just create or delete.
export interface ResourceActions {
  create?: boolean;
  edit?: boolean;
  delete?: boolean;
}

export const readOnlyActions: ResourceActions = { create: false, edit: false, delete: false };

interface ResourceListProps<T extends BaseRecord> {
  resource: string;
  columns: ResourceColumn<T>[];
  basePath: string;
  title: TranslationKey;
  actions?: ResourceActions;
  // Primary key column(s). Defaults to ['id']. Refine's Hasura provider can
  // only address rows by an `id` column (`<table>_by_pk(id: ...)`), so tables
  // keyed otherwise (e.g. payment_user_notification_settings by user_id,
  // payment_shop_product_relations by a composite key) never get edit/delete
  // buttons, whatever `actions` says.
  primaryKey?: string[];
}

export function ResourceList<T extends BaseRecord = BaseRecord>({
  resource,
  columns,
  basePath,
  title,
  actions,
  primaryKey = ['id'],
}: ResourceListProps<T>) {
  const { t } = useTranslation();
  const fields = Array.from(new Set([...primaryKey, ...columns.map((c) => c.key)]));
  const addressableById = primaryKey.length === 1 && primaryKey[0] === 'id';
  const canCreate = actions?.create ?? true;
  const canEdit = addressableById && (actions?.edit ?? true);
  const canDelete = addressableById && (actions?.delete ?? true);
  const hasRowActions = canEdit || canDelete;
  const colSpan = columns.length + (hasRowActions ? 1 : 0);
  const { tableQuery, currentPage, setCurrentPage, pageCount, result } = useTable<T>({
    resource,
    meta: { fields },
  });
  const { mutate: deleteOne } = useDelete();

  const data = result.data ?? [];
  const isLoading = tableQuery.isLoading;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t(title)}</h1>
        {canCreate && (
          <Button asChild>
            <Link href={`${basePath}/new`}>
              <Plus className="size-4" />
              {t('common.new')}
            </Link>
          </Button>
        )}
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.key}>{t(c.header)}</TableHead>
              ))}
              {hasRowActions && <TableHead className="w-24" />}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={colSpan} className="text-center text-muted-foreground">
                  {t('common.loading')}
                </TableCell>
              </TableRow>
            )}
            {!isLoading && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={colSpan} className="text-center text-muted-foreground">
                  {t('common.noRecords')}
                </TableCell>
              </TableRow>
            )}
            {data.map((record) => (
              <TableRow key={primaryKey.map((k) => String((record as any)[k])).join(':')}>
                {columns.map((c) => (
                  <TableCell key={c.key}>
                    {c.render ? c.render(record, t) : String((record as any)[c.key] ?? '')}
                  </TableCell>
                ))}
                {hasRowActions && (
                  <TableCell>
                    <div className="flex gap-1 justify-end">
                      {canEdit && (
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`${basePath}/${record.id}/edit`}>
                            <Pencil className="size-4" />
                          </Link>
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            if (window.confirm(t('common.deleteConfirm'))) {
                              deleteOne({ resource, id: record.id as number });
                            }
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {t('common.pageOf', { current: currentPage, total: pageCount || 1 })}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((c) => c - 1)}
          >
            {t('common.previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= (pageCount || 1)}
            onClick={() => setCurrentPage((c) => c + 1)}
          >
            {t('common.next')}
          </Button>
        </div>
      </div>
    </div>
  );
}
