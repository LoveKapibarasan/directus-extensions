'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Plus, RefreshCw } from 'lucide-react';
import { Button } from '@lib/components/ui/button';
import { Badge } from '@lib/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@lib/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@lib/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@lib/components/ui/table';
import {
  FIELDS,
  type ColumnPair,
  type ConsistencyReport,
  type Entity,
  type Mapping,
  type Status,
  type Value,
} from '@lib/server/consistency-mapping';
import { useTranslation } from '@lib/i18n/locale-provider';
import type { TranslationKey } from '@lib/i18n/translations';

const STATUS_LABEL: Record<Status, TranslationKey> = {
  match: 'consistencyCheck.statusMatch',
  mismatch: 'consistencyCheck.statusMismatch',
  missing_in_payments: 'consistencyCheck.statusMissingInPayments',
  missing_in_core: 'consistencyCheck.statusMissingInCore',
};

const STATUS_VARIANT: Record<Status, 'success' | 'outline' | 'destructive'> = {
  match: 'success',
  mismatch: 'outline',
  missing_in_payments: 'destructive',
  missing_in_core: 'destructive',
};

// Problems first, consistent rows last.
const STATUS_ORDER: Record<Status, number> = { mismatch: 0, missing_in_payments: 1, missing_in_core: 2, match: 3 };

const ENTITIES: { entity: Entity; titleKey: TranslationKey; path: string }[] = [
  { entity: 'station', titleKey: 'consistencyCheck.stations', path: '/stations' },
  { entity: 'evse', titleKey: 'nav.evses', path: '/evses' },
  { entity: 'connector', titleKey: 'nav.connectors', path: '/connectors' },
  { entity: 'location', titleKey: 'nav.locations', path: '/locations' },
];

const show = (v: Value) => (v == null || v === '' ? '∅' : String(v));

function Action({ mapping, path }: { mapping: Mapping; path: string }) {
  const { t } = useTranslation();
  if (mapping.status === 'match') return null;
  if (mapping.status === 'missing_in_payments' && mapping.prefill) {
    return (
      <Button asChild size="sm" variant="outline">
        <Link href={`${path}/new?${new URLSearchParams(mapping.prefill)}`}>
          <Plus className="size-4" />
          {t('consistencyCheck.create')}
        </Link>
      </Button>
    );
  }
  if (mapping.payment) {
    return (
      <Button asChild size="sm" variant="outline">
        <Link href={`${path}/${mapping.payment.id}/edit`}>
          <Pencil className="size-4" />
          {t('consistencyCheck.edit')}
        </Link>
      </Button>
    );
  }
  return null;
}

/** One compared field: core value over payment value; red when they differ. */
function ValueCell({ pair }: { pair: ColumnPair | undefined }) {
  if (!pair) return <TableCell className="text-muted-foreground align-top">—</TableCell>;
  return (
    <TableCell
      data-equal={pair.equal}
      title={`${pair.core} = ${show(pair.coreValue)}\n${pair.payment} = ${show(pair.paymentValue)}`}
      className={
        pair.equal
          ? 'align-top font-mono text-xs text-muted-foreground'
          : 'align-top font-mono text-xs bg-destructive/10 text-destructive font-semibold'
      }
    >
      <div>{show(pair.coreValue)}</div>
      <div>{show(pair.paymentValue)}</div>
    </TableCell>
  );
}

function EntityCard({
  entity,
  titleKey,
  path,
  report,
  problemsOnly,
}: {
  entity: Entity;
  titleKey: TranslationKey;
  path: string;
  report: ConsistencyReport;
  problemsOnly: boolean;
}) {
  const { t } = useTranslation();
  const all = report.mappings.filter((m) => m.entity === entity);
  const rows = (problemsOnly ? all.filter((m) => m.status !== 'match') : all)
    .slice()
    .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || a.label.localeCompare(b.label));
  const fields = FIELDS[entity];
  // The column names behind each field, from the first row that has them.
  const columnsOf = (field: string) =>
    all.flatMap((m) => m.columns).find((c) => c.field === field);
  const counts = report.summary[entity];

  return (
    <Card data-testid={`mappings-${entity}`}>
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          {t(titleKey)}
          {(Object.keys(STATUS_LABEL) as Status[])
            .filter((s) => counts[s] > 0)
            .map((s) => (
              <Badge key={s} variant={STATUS_VARIANT[s]}>
                {t(STATUS_LABEL[s])} {counts[s]}
              </Badge>
            ))}
        </CardTitle>
        {all[0] && (
          <p className="text-muted-foreground text-xs">
            {t('consistencyCheck.matchedOn')}: <code>{all[0].matchedOn}</code>
          </p>
        )}
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {all.length === 0 ? t('consistencyCheck.noRows') : t('consistencyCheck.noIssues')}
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-36">{t('consistencyCheck.status')}</TableHead>
                <TableHead>{t('consistencyCheck.item')}</TableHead>
                <TableHead>
                  <div>{t('consistencyCheck.rows')}</div>
                  <div className="text-[10px] font-normal text-muted-foreground">
                    {t('consistencyCheck.coreOverPayment')}
                  </div>
                </TableHead>
                {fields.map((f) => {
                  const c = columnsOf(f);
                  return (
                    <TableHead key={f} className="align-bottom">
                      <div>{t(`consistencyCheck.field.${entity}.${f}` as TranslationKey)}</div>
                      {c && (
                        <div className="font-mono text-[10px] font-normal text-muted-foreground">
                          <div>{c.core}</div>
                          <div>{c.payment}</div>
                        </div>
                      )}
                    </TableHead>
                  );
                })}
                <TableHead className="w-24" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((m) => (
                <TableRow key={`${m.core?.id ?? '-'}:${m.payment?.id ?? '-'}:${m.label}`} data-status={m.status}>
                  <TableCell className="align-top">
                    <Badge variant={STATUS_VARIANT[m.status]}>{t(STATUS_LABEL[m.status])}</Badge>
                  </TableCell>
                  <TableCell className="align-top font-medium">{m.label}</TableCell>
                  <TableCell className="align-top font-mono text-xs">
                    <div>{m.core ? `${m.core.table} #${m.core.id}` : '—'}</div>
                    <div>{m.payment ? `${m.payment.table} #${m.payment.id}` : '—'}</div>
                  </TableCell>
                  {fields.map((f) => (
                    <ValueCell key={f} pair={m.columns.find((c) => c.field === f)} />
                  ))}
                  <TableCell className="align-top">
                    <Action mapping={m} path={path} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default function ConsistencyCheckPage() {
  const { t } = useTranslation();
  const [report, setReport] = useState<ConsistencyReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'problems'>('all');

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch('/api/consistency-check')
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json().catch(() => ({})))?.error ?? `HTTP ${res.status}`);
        return res.json();
      })
      .then((data: ConsistencyReport) => setReport(data))
      .catch((err) => setError(err instanceof Error ? err.message : String(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{t('nav.consistencyCheck')}</h1>
          <p className="text-muted-foreground text-sm">{t('consistencyCheck.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as 'all' | 'problems')}>
            <TabsList>
              <TabsTrigger value="all">{t('consistencyCheck.filterAll')}</TabsTrigger>
              <TabsTrigger value="problems">{t('consistencyCheck.filterProblems')}</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={load} disabled={loading} variant="outline">
            <RefreshCw className={loading ? 'size-4 animate-spin' : 'size-4'} />
            {loading ? t('consistencyCheck.checking') : t('consistencyCheck.rerun')}
          </Button>
        </div>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="text-destructive text-sm pt-6">
            {t('consistencyCheck.errorPrefix', { error })}
          </CardContent>
        </Card>
      )}

      {report && (
        <>
          <details className="rounded-md border px-4 py-3 text-sm text-muted-foreground">
            <summary className="cursor-pointer select-none">
              {t('consistencyCheck.notes', { count: report.caveats.length + 1 })}
            </summary>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li>
                {t('consistencyCheck.tariffCountLine', {
                  core: report.tariffCounts.core,
                  payments: report.tariffCounts.payments,
                })}
              </li>
              {report.caveats.map((c) => (
                <li key={c}>{t(c)}</li>
              ))}
            </ul>
          </details>

          {ENTITIES.map((e) => (
            <EntityCard key={e.entity} {...e} report={report} problemsOnly={filter === 'problems'} />
          ))}
        </>
      )}
    </div>
  );
}
