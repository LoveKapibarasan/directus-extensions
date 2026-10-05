'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { SalesRow, SalesView } from '@lib/server/sales';

export type SalesMetric = 'revenue' | 'sessions' | 'kwh';

const COLORS = ['#16a34a', '#2563eb', '#d97706', '#9333ea', '#dc2626'];

function value(row: SalesRow, metric: SalesMetric): number {
  if (metric === 'revenue') return row.revenueCents / 100;
  if (metric === 'sessions') return row.sessions;
  return Math.round(row.kwh * 1000) / 1000;
}

/**
 * One bar per period / location / operator. Revenue is split into one series
 * per currency -- euros and zloty on one axis would be a sum nobody can read --
 * while sessions and kWh are currency-free and stack into one bar.
 */
export function SalesChart({
  rows,
  view,
  metric,
  groupLabel,
  metricLabel,
  locale,
}: {
  rows: SalesRow[];
  view: Exclude<SalesView, 'summary'>;
  metric: SalesMetric;
  groupLabel: (row: SalesRow) => string;
  metricLabel: string;
  locale: string;
}) {
  const currencies = [...new Set(rows.map((r) => r.currency || '—'))];
  const series = metric === 'revenue' ? currencies : [metricLabel];
  const byGroup = new Map<string, Record<string, string | number>>();
  for (const r of rows) {
    const name = groupLabel(r);
    const entry = byGroup.get(name) ?? { name };
    const key = metric === 'revenue' ? r.currency || '—' : metricLabel;
    entry[key] = ((entry[key] as number | undefined) ?? 0) + value(r, metric);
    byGroup.set(name, entry);
  }
  const data = [...byGroup.values()];
  const horizontal = view === 'location' || view === 'operator';
  const format = (n: number) => new Intl.NumberFormat(locale, { maximumFractionDigits: metric === 'sessions' ? 0 : 2 }).format(n);

  return (
    <div data-testid="sales-chart" className="h-[420px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout={horizontal ? 'vertical' : 'horizontal'} margin={{ left: horizontal ? 24 : 0, right: 16 }}>
          <CartesianGrid strokeDasharray="3 3" />
          {horizontal ? (
            <>
              <XAxis type="number" tickFormatter={format} />
              <YAxis type="category" dataKey="name" width={160} />
            </>
          ) : (
            <>
              <XAxis dataKey="name" />
              <YAxis tickFormatter={format} />
            </>
          )}
          <Tooltip formatter={(v) => format(Number(v))} />
          {series.length > 1 && <Legend />}
          {series.map((s, i) => (
            <Bar key={s} dataKey={s} name={metric === 'revenue' ? `${metricLabel} (${s})` : s} fill={COLORS[i % COLORS.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
