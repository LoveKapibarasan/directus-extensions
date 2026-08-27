'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { RefreshCw, Pencil, Plus } from 'lucide-react';
import { Button } from '@lib/components/ui/button';
import { Badge } from '@lib/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@lib/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@lib/components/ui/table';
import type { Finding, ConsistencyReport } from '@lib/server/consistency-check';

const kindLabel: Record<Finding['kind'], string> = {
  missing_in_payments: 'Missing in payments',
  orphaned_in_payments: 'Orphaned in payments',
  field_mismatch: 'Field mismatch',
  unmatched: 'Unmatched',
  tariff_mismatch: 'Tariff mismatch',
  evse_count_mismatch: 'EVSE count mismatch',
};

const kindVariant: Record<Finding['kind'], 'destructive' | 'outline' | 'secondary'> = {
  missing_in_payments: 'destructive',
  orphaned_in_payments: 'destructive',
  field_mismatch: 'outline',
  unmatched: 'outline',
  tariff_mismatch: 'outline',
  evse_count_mismatch: 'secondary',
};

function FindingAction({ finding }: { finding: Finding }) {
  if (finding.entity === 'evse' && finding.kind === 'missing_in_payments') {
    const params = new URLSearchParams({ evse_id: finding.core.evseId });
    if (finding.core.evseTypeId != null) params.set('ocpp_evse_id', String(finding.core.evseTypeId));
    if (finding.core.stationOcppName) params.set('station_id', finding.core.stationOcppName);
    return (
      <Button asChild size="sm" variant="outline">
        <Link href={`/evses/new?${params.toString()}`}>
          <Plus className="size-4" />
          Create
        </Link>
      </Button>
    );
  }
  if (finding.entity === 'evse' && (finding.kind === 'orphaned_in_payments' || finding.kind === 'field_mismatch')) {
    return (
      <Button asChild size="sm" variant="outline">
        <Link href={`/evses/${finding.payment.id}/edit`}>
          <Pencil className="size-4" />
          Edit
        </Link>
      </Button>
    );
  }
  if (finding.entity === 'location' && finding.kind === 'missing_in_payments') {
    const params = new URLSearchParams();
    if (finding.core.name) params.set('name', finding.core.name);
    return (
      <Button asChild size="sm" variant="outline">
        <Link href={`/locations/new?${params.toString()}`}>
          <Plus className="size-4" />
          Create
        </Link>
      </Button>
    );
  }
  if (finding.entity === 'location' && finding.kind === 'orphaned_in_payments') {
    return (
      <Button asChild size="sm" variant="outline">
        <Link href={`/locations/${finding.payment.id}/edit`}>
          <Pencil className="size-4" />
          Edit
        </Link>
      </Button>
    );
  }
  if (finding.entity === 'connector') {
    return (
      <Button asChild size="sm" variant="outline">
        <Link href={`/connectors/${finding.payment.id}/edit`}>
          <Pencil className="size-4" />
          Edit
        </Link>
      </Button>
    );
  }
  return null;
}

const ENTITY_TITLES: { entity: Finding['entity']; title: string }[] = [
  { entity: 'evse', title: 'EVSEs' },
  { entity: 'location', title: 'Locations' },
  { entity: 'connector', title: 'Connectors' },
  { entity: 'station', title: 'Charging stations' },
];

export default function ConsistencyCheckPage() {
  const [report, setReport] = useState<ConsistencyReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Consistency Check</h1>
          <p className="text-muted-foreground text-sm">
            Compares payment_* tables against citrineos-core's Locations / EVSEs / Connectors /
            ChargingStations / Tariffs.
          </p>
        </div>
        <Button onClick={load} disabled={loading} variant="outline">
          <RefreshCw className={loading ? 'size-4 animate-spin' : 'size-4'} />
          {loading ? 'Checking...' : 'Re-run check'}
        </Button>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardContent className="text-destructive text-sm pt-6">
            Couldn&apos;t run the check: {error}
          </CardContent>
        </Card>
      )}

      {report && (
        <>
          <Card>
            <CardContent className="pt-6 text-sm text-muted-foreground space-y-1">
              <p>
                {report.tariffCounts.core} core Tariff(s), {report.tariffCounts.payments} payment_tariffs
                row(s). See caveats below — tariffs can&apos;t be matched 1:1.
              </p>
              <ul className="list-disc pl-5 space-y-1">
                {report.caveats.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {ENTITY_TITLES.map(({ entity, title }) => {
            const findings = report.findings.filter((f) => f.entity === entity);
            return (
              <Card key={entity}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {title}
                    <Badge variant={findings.length ? 'destructive' : 'success'}>
                      {findings.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {findings.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No issues found.</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Details</TableHead>
                          <TableHead className="w-24">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {findings.map((f, i) => (
                          <TableRow key={i}>
                            <TableCell>
                              <Badge variant={kindVariant[f.kind]}>{kindLabel[f.kind]}</Badge>
                            </TableCell>
                            <TableCell className="text-sm">{f.message}</TableCell>
                            <TableCell>
                              <FindingAction finding={f} />
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
