// Standalone entry point bundled separately from the Next.js app (see
// scripts: build:extension). Uses the host's global React/ReactDOM instead
// of importing its own copy, so it mounts as a normal component inside
// Operator-UI's own render tree — no iframe, no postMessage.
declare const React: typeof import('react');
declare const ReactDOM: { createRoot: (typeof import('react-dom/client'))['createRoot'] };

const PAYMENT_TABLES = [
  'payment_checkouts',
  'payment_users',
  'payment_subscription_plans',
  'payment_rfid_subscriptions',
  'payment_rfid_cards',
  'payment_operators',
  'payment_operator_infos',
  'payment_locations',
  'payment_evses',
  'payment_connectors',
  'payment_tariffs',
  'payment_meter_value_history',
] as const;

// Self-contained design tokens; kept as plain style objects (not Tailwind
// classes) because this bundle is injected into a host page whose
// stylesheet was built without knowledge of this source, so no utility
// classes are guaranteed to exist there.
const colors = {
  border: '#e2e5ea',
  borderStrong: '#c9ced8',
  bg: '#ffffff',
  bgSubtle: '#f7f8fa',
  text: '#1a1d23',
  textMuted: '#6b7280',
  accent: '#2563eb',
  accentHover: '#1d4ed8',
  headerBg: '#f1f3f6',
};

const styles = {
  panel: {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    color: colors.text,
    maxWidth: 960,
  } as React.CSSProperties,
  tabs: {
    display: 'flex',
    gap: 4,
    marginBottom: 20,
    borderBottom: `1px solid ${colors.border}`,
  } as React.CSSProperties,
  tabButton: (active: boolean): React.CSSProperties => ({
    appearance: 'none',
    border: 'none',
    background: 'transparent',
    cursor: active ? 'default' : 'pointer',
    padding: '10px 16px',
    fontSize: 14,
    fontWeight: 500,
    color: active ? colors.accent : colors.textMuted,
    borderBottom: `2px solid ${active ? colors.accent : 'transparent'}`,
    marginBottom: -1,
    transition: 'color 120ms ease',
  }),
  card: {
    border: `1px solid ${colors.border}`,
    borderRadius: 10,
    padding: 20,
    background: colors.bg,
  } as React.CSSProperties,
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  } as React.CSSProperties,
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  } as React.CSSProperties,
  input: {
    border: `1px solid ${colors.borderStrong}`,
    borderRadius: 6,
    padding: '8px 10px',
    fontSize: 14,
    color: colors.text,
    background: colors.bg,
  } as React.CSSProperties,
  select: {
    border: `1px solid ${colors.borderStrong}`,
    borderRadius: 6,
    padding: '8px 10px',
    fontSize: 14,
    color: colors.text,
    background: colors.bg,
    marginBottom: 16,
  } as React.CSSProperties,
  buttonPrimary: (disabled: boolean): React.CSSProperties => ({
    appearance: 'none',
    border: 'none',
    borderRadius: 6,
    padding: '9px 18px',
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
    background: disabled ? colors.borderStrong : colors.accent,
    cursor: disabled ? 'default' : 'pointer',
  }),
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
    borderRadius: 8,
    overflow: 'hidden',
  } as React.CSSProperties,
  th: {
    textAlign: 'left',
    padding: '10px 12px',
    background: colors.headerBg,
    color: colors.textMuted,
    fontWeight: 600,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    borderBottom: `1px solid ${colors.border}`,
  } as React.CSSProperties,
  td: {
    padding: '9px 12px',
    borderBottom: `1px solid ${colors.border}`,
  } as React.CSSProperties,
  muted: {
    color: colors.textMuted,
    fontSize: 13,
  } as React.CSSProperties,
};

function Icon({ paths, size = 16 }: { paths: string[]; size?: number }) {
  return React.createElement(
    'svg',
    {
      width: size,
      height: size,
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: 2,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      style: { flexShrink: 0 },
    },
    paths.map((d, i) => React.createElement('path', { key: i, d })),
  );
}

const DownloadIcon = () =>
  Icon({ paths: ['M12 15V3', 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4', 'm7 10 5 5 5-5'] });

const TableIcon = () =>
  Icon({ paths: ['M3 9h18', 'M3 15h18', 'M12 3v18'] });

interface PanelProps {
  apiBase: string;
  getToken: () => Promise<string>;
}

function ExportTransactionsTab({ apiBase, getToken }: PanelProps) {
  const { useState } = React;
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [downloading, setDownloading] = useState(false);

  const download = async () => {
    setDownloading(true);
    try {
      const token = await getToken();
      const res = await fetch(
        `${apiBase}/api/export-transactions?from=${from}&to=${to}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error(await res.text());
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions_${from}_${to}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  return React.createElement(
    'div',
    { style: styles.card },
    React.createElement(
      'div',
      { style: { display: 'flex', gap: 16, alignItems: 'end', flexWrap: 'wrap' } },
      React.createElement(
        'div',
        { style: styles.field },
        React.createElement('label', { style: styles.label }, 'From'),
        React.createElement('input', {
          type: 'date',
          value: from,
          style: styles.input,
          onChange: (e: any) => setFrom(e.target.value),
        }),
      ),
      React.createElement(
        'div',
        { style: styles.field },
        React.createElement('label', { style: styles.label }, 'To'),
        React.createElement('input', {
          type: 'date',
          value: to,
          style: styles.input,
          onChange: (e: any) => setTo(e.target.value),
        }),
      ),
      React.createElement(
        'button',
        {
          onClick: download,
          disabled: downloading,
          style: { ...styles.buttonPrimary(downloading), display: 'flex', alignItems: 'center', gap: 6 },
        },
        React.createElement(DownloadIcon),
        downloading ? 'Downloading…' : 'Download Excel',
      ),
    ),
  );
}

function EditableCell({
  value,
  editable,
  onSave,
}: {
  value: any;
  editable: boolean;
  onSave: (next: string) => Promise<void>;
}) {
  const { useState } = React;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ''));
  const [saving, setSaving] = useState(false);

  if (!editable) {
    return React.createElement('td', { style: styles.td }, String(value ?? ''));
  }

  if (!editing) {
    return React.createElement(
      'td',
      {
        style: { ...styles.td, cursor: 'pointer' },
        title: 'Click to edit',
        onDoubleClick: () => {
          setDraft(String(value ?? ''));
          setEditing(true);
        },
      },
      String(value ?? ''),
    );
  }

  const commit = async () => {
    if (draft === String(value ?? '')) {
      setEditing(false);
      return;
    }
    setSaving(true);
    try {
      await onSave(draft);
    } finally {
      setSaving(false);
      setEditing(false);
    }
  };

  return React.createElement(
    'td',
    { style: { ...styles.td, padding: 4 } },
    React.createElement('input', {
      autoFocus: true,
      value: draft,
      disabled: saving,
      style: { ...styles.input, padding: '4px 6px', width: '100%' },
      onChange: (e: any) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown: (e: any) => {
        if (e.key === 'Enter') commit();
        if (e.key === 'Escape') setEditing(false);
      },
    }),
  );
}

function PaymentsTab({ apiBase, getToken }: PanelProps) {
  const { useState, useEffect, useMemo } = React;
  const [table, setTable] = useState<string>(PAYMENT_TABLES[0]);
  const [fields, setFields] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getToken()
      .then((token) =>
        fetch(`${apiBase}/api/payments?table=${table}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      )
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        setFields(d.fields || []);
        setRows(d.rows || []);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [table]);

  const filteredRows = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((row) =>
      fields.some((f) => String(row[f] ?? '').toLowerCase().includes(q)),
    );
  }, [rows, fields, search]);

  const saveCell = async (id: number, field: string, next: string) => {
    const token = await getToken();
    const res = await fetch(`${apiBase}/api/payments?table=${table}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ id, field, value: next }),
    });
    if (!res.ok) {
      window.alert('Save failed: ' + (await res.text()));
      return;
    }
    setRows((prev: any[]) => prev.map((r) => (r.id === id ? { ...r, [field]: next } : r)));
  };

  return React.createElement(
    'div',
    { style: styles.card },
    React.createElement(
      'div',
      { style: { display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap' } },
      React.createElement(
        'select',
        {
          value: table,
          style: { ...styles.select, marginBottom: 0 },
          onChange: (e: any) => setTable(e.target.value),
        },
        PAYMENT_TABLES.map((t) => React.createElement('option', { key: t, value: t }, t)),
      ),
      React.createElement('input', {
        type: 'text',
        placeholder: 'Search…',
        value: search,
        style: { ...styles.input, flex: 1, minWidth: 160 },
        onChange: (e: any) => setSearch(e.target.value),
      }),
    ),
    loading &&
      React.createElement('p', { style: styles.muted }, 'Loading…'),
    !loading &&
      React.createElement(
        'div',
        { style: { overflowX: 'auto', border: `1px solid ${colors.border}`, borderRadius: 8 } },
        React.createElement(
          'table',
          { style: styles.table },
          React.createElement(
            'thead',
            null,
            React.createElement(
              'tr',
              null,
              fields.map((f) => React.createElement('th', { key: f, style: styles.th }, f)),
            ),
          ),
          React.createElement(
            'tbody',
            null,
            filteredRows.length === 0
              ? React.createElement(
                  'tr',
                  null,
                  React.createElement(
                    'td',
                    { style: { ...styles.td, ...styles.muted }, colSpan: fields.length || 1 },
                    'No rows',
                  ),
                )
              : filteredRows.map((row, i) =>
                  React.createElement(
                    'tr',
                    { key: row.id ?? i, style: i % 2 === 1 ? { background: colors.bgSubtle } : undefined },
                    fields.map((f) =>
                      React.createElement(EditableCell, {
                        key: f,
                        value: row[f],
                        editable: f !== 'id',
                        onSave: (next: string) => saveCell(row.id, f, next),
                      }),
                    ),
                  ),
                ),
          ),
        ),
      ),
    React.createElement(
      'p',
      { style: { ...styles.muted, marginTop: 8 } },
      'Double-click a cell to edit. Press Enter to save, Esc to cancel.',
    ),
  );
}

function Panel(props: PanelProps) {
  const { useState } = React;
  const [tab, setTab] = useState<'export' | 'payments'>('export');
  return React.createElement(
    'div',
    { style: styles.panel },
    React.createElement(
      'div',
      { style: styles.tabs },
      React.createElement(
        'button',
        { onClick: () => setTab('export'), style: { ...styles.tabButton(tab === 'export'), display: 'flex', alignItems: 'center', gap: 6 } },
        React.createElement(DownloadIcon),
        'Export Transactions',
      ),
      React.createElement(
        'button',
        { onClick: () => setTab('payments'), style: { ...styles.tabButton(tab === 'payments'), display: 'flex', alignItems: 'center', gap: 6 } },
        React.createElement(TableIcon),
        'Payments',
      ),
    ),
    tab === 'export'
      ? React.createElement(ExportTransactionsTab, props)
      : React.createElement(PaymentsTab, props),
  );
}

function mount(container: HTMLElement, props: PanelProps) {
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(Panel, props));
  return () => root.unmount();
}

(window as any).OpsToolsExtension = { mount };
