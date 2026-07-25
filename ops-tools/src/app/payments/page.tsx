'use client';

import { useEffect, useState } from 'react';
import { PAYMENT_TABLES } from '@/lib/paymentTables';
import { apiUrl, authHeaders, useEmbedToken } from '@/lib/embed-auth';

export default function PaymentsPage() {
  const [table, setTable] = useState<string>(PAYMENT_TABLES[0]);
  const [fields, setFields] = useState<string[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const token = useEmbedToken();

  useEffect(() => {
    setLoading(true);
    fetch(apiUrl(`/api/payments?table=${table}`), { headers: authHeaders(token) })
      .then((r) => r.json())
      .then((d) => {
        setFields(d.fields || []);
        setRows(d.rows || []);
      })
      .finally(() => setLoading(false));
  }, [table, token]);

  return (
    <div>
      <h1>Payments DB Viewer (read-only)</h1>
      <select value={table} onChange={(e) => setTable(e.target.value)}>
        {PAYMENT_TABLES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>
      {loading && <p>Loading...</p>}
      {!loading && (
        <table border={1} cellPadding={4} style={{ marginTop: 12, borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {fields.map((f) => (
                <th key={f}>{f}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {fields.map((f) => (
                  <td key={f}>{String(row[f] ?? '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
