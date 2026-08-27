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

interface ResourceListProps<T extends BaseRecord> {
  resource: string;
  columns: ResourceColumn<T>[];
  basePath: string;
  title: TranslationKey;
}

export function ResourceList<T extends BaseRecord = BaseRecord>({
  resource,
  columns,
  basePath,
  title,
}: ResourceListProps<T>) {
  const { t } = useTranslation();
  const fields = Array.from(new Set(['id', ...columns.map((c) => c.key)]));
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
        <Button asChild>
          <Link href={`${basePath}/new`}>
            <Plus className="size-4" />
            {t('common.new')}
          </Link>
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => (
                <TableHead key={c.key}>{t(c.header)}</TableHead>
              ))}
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground">
                  {t('common.loading')}
                </TableCell>
              </TableRow>
            )}
            {!isLoading && data.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground">
                  {t('common.noRecords')}
                </TableCell>
              </TableRow>
            )}
            {data.map((record) => (
              <TableRow key={String(record.id)}>
                {columns.map((c) => (
                  <TableCell key={c.key}>
                    {c.render ? c.render(record, t) : String((record as any)[c.key] ?? '')}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`${basePath}/${record.id}/edit`}>
                        <Pencil className="size-4" />
                      </Link>
                    </Button>
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
                  </div>
                </TableCell>
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
