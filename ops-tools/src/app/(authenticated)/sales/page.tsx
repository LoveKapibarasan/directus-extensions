'use client';

import { useCallback, useEffect, useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@lib/components/ui/button';
import { Input } from '@lib/components/ui/input';
import { Label } from '@lib/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@lib/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@lib/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@lib/components/ui/table';
import { useTranslation } from '@lib/i18n/locale-provider';
import type { TranslationKey } from '@lib/i18n/translations';
import { SALES_VIEWS, type SalesRow, type SalesView } from '@lib/server/sales';

const VIEW_LABEL: Record<SalesView, TranslationKey> = {
  summary: 'sales.viewSummary',
  location: 'sales.viewLocation',
  operator: 'sales.viewOperator',
  day: 'sales.viewDay',
  month: 'sales.viewMonth',
};

const GROUP_HEADER: Record<SalesView, TranslationKey> = {
  summary: 'sales.period',
  location: 'sales.location',
  operator: 'sales.operator',
  day: 'sales.day',
  month: 'sales.month',
};

function firstOfMonth() {
  const d = new Date();
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), 1)).toISOString().slice(0, 10);
}

export default function SalesPage() {
  const { t, locale } = useTranslation();
  const [from, setFrom] = useState(firstOfMonth);
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [view, setView] = useState<SalesView>('summary');
  const [rows, setRows] = useState<SalesRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const query = `from=${from}&to=${to}&view=${view}`;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/sales?${query}`);
      const body = await res.json();
      if (!res.ok) throw new Error(body.error ?? res.statusText);
      setRows(body.rows);
    } catch (e) {
      setRows(null);
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    if (from && to) void load();
  }, [load, from, to]);

  const download = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/sales?${query}&format=xlsx`);
      if (!res.ok) throw new Error(await res.text());
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement('a');
      a.href = url;
      a.download = `sales_${view}_${from}_${to}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const money = (cents: number | null, currency: string) => {
    if (cents == null) return '—';
    if (!/^[A-Z]{3}$/.test(currency)) return (cents / 100).toFixed(2);
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(cents / 100);
  };
  const energy = (kwh: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: 3 }).format(kwh);
  const groupLabel = (r: SalesRow) =>
    view === 'summary' ? `${from} – ${to}` : (r.label ?? (r.key || t('sales.unassigned')));

  return (
    <div className="p-6 max-w-5xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{t('nav.sales')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="grid gap-2">
              <Label htmlFor="from">{t('sales.from')}</Label>
              <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="to">{t('sales.to')}</Label>
              <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <Button variant="outline" onClick={download} loading={downloading} disabled={!rows}>
              <Download className="size-4" />
              {t('sales.download')}
            </Button>
          </div>
          <Tabs value={view} onValueChange={(v) => setView(v as SalesView)}>
            <TabsList>
              {SALES_VIEWS.map((v) => (
                <TabsTrigger key={v} value={v}>
                  {t(VIEW_LABEL[v])}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <p className="text-muted-foreground text-xs">{t('sales.note')}</p>
        </CardContent>
      </Card>

      {error && <p className="text-destructive text-sm">{error}</p>}
      {loading && !rows && <p className="text-muted-foreground text-sm">{t('common.loading')}</p>}
      {rows && rows.length === 0 && <p className="text-muted-foreground text-sm">{t('sales.empty')}</p>}
      {rows && rows.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t(GROUP_HEADER[view])}</TableHead>
              <TableHead>{t('sales.currency')}</TableHead>
              <TableHead className="text-right">{t('sales.sessions')}</TableHead>
              <TableHead className="text-right">{t('sales.revenue')}</TableHead>
              <TableHead className="text-right">{t('sales.kwh')}</TableHead>
              <TableHead className="text-right">{t('sales.exportedKwh')}</TableHead>
              <TableHead className="text-right">{t('sales.platformFee')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={`${r.key}-${r.currency}`}>
                <TableCell>{groupLabel(r)}</TableCell>
                <TableCell>{r.currency || '—'}</TableCell>
                <TableCell className="text-right">{r.sessions}</TableCell>
                <TableCell className="text-right">{money(r.revenueCents, r.currency)}</TableCell>
                <TableCell className="text-right">{energy(r.kwh)}</TableCell>
                <TableCell className="text-right">{energy(r.exportedKwh)}</TableCell>
                <TableCell className="text-right">{money(r.platformFeeCents, r.currency)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
