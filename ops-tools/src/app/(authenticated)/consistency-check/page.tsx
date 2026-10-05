'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, Pencil, Plus, RefreshCw, X } from 'lucide-react';
import { Button } from '@lib/components/ui/button';
import { Badge } from '@lib/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@lib/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@lib/components/ui/tabs';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@lib/components/ui/table';
import type { ConsistencyReport, Entity, Mapping, Status, Value } from '@lib/server/consistency-mapping';
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

const ENTITIES: { entity: Entity; titleKey: TranslationKey; path: string }[] = [
  { entity: 'station', titleKey: 'consistencyCheck.stations', path: '/stations' },
  { entity: 'evse', titleKey: 'nav.evses', path: '/evses' },
  { entity: 'connector', titleKey: 'nav.connectors', path: '/connectors' },
  { entity: 'location', titleKey: 'nav.locations', path: '/locations' },
];

const show = (v: Value) => (v == null ? '∅' : String(v));

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
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground space-y-1">
              <p>
                {t('consistencyCheck.tariffCountLine', {
                  core: report.tariffCounts.core,
                  payments: report.tariffCounts.payments,
                })}
              </p>
              <ul className="list-disc pl-5 space-y-1">
                {report.caveats.map((c) => (
                  <li key={c}>{t(c)}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {ENTITIES.map(({ entity, titleKey, path }) => {
            const all = report.mappings.filter((m) => m.entity === entity);
            const rows = filter === 'all' ? all : all.filter((m) => m.status !== 'match');
            const counts = report.summary[entity];
            return (
              <Card key={entity} data-testid={`mappings-${entity}`}>
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
                    <p className="text-muted-foreground text-xs font-mono">
                      {t('consistencyCheck.matchedOn')}: {all[0].matchedOn}
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
                          <TableHead>{t('consistencyCheck.status')}</TableHead>
                          <TableHead>{t('consistencyCheck.item')}</TableHead>
                          <TableHead>{t('consistencyCheck.coreRow')}</TableHead>
                          <TableHead>{t('consistencyCheck.paymentRow')}</TableHead>
                          <TableHead>{t('consistencyCheck.columns')}</TableHead>
                          <TableHead className="w-24">{t('consistencyCheck.action')}</TableHead>
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
                              {m.core ? `${m.core.table} #${m.core.id}` : '—'}
                            </TableCell>
                            <TableCell className="align-top font-mono text-xs">
                              {m.payment ? `${m.payment.table} #${m.payment.id}` : '—'}
                            </TableCell>
                            <TableCell className="align-top">
                              <table className="text-xs font-mono">
                                <tbody>
                                  {m.columns.map((c) => (
                                    <tr
                                      key={`${c.core}|${c.payment}`}
                                      data-equal={c.equal}
                                      className={c.equal ? 'text-muted-foreground' : 'text-destructive font-semibold'}
                                    >
                                      <td className="pr-2 align-top">
                                        {c.equal ? <Check className="size-3.5" /> : <X className="size-3.5" />}
                                      </td>
                                      <td className="pr-2 align-top">
                                        {c.core} = {show(c.coreValue)}
                                      </td>
                                      <td className="pr-2 align-top">↔</td>
                                      <td className="align-top">
                                        {c.payment} = {show(c.paymentValue)}
                                        {c.key ? ` (${t('consistencyCheck.key')})` : ''}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </TableCell>
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
          })}
        </>
      )}
    </div>
  );
}
