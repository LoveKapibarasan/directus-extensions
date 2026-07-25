'use client';

import { useState } from 'react';
import { apiUrl, authHeaders, useEmbedToken } from '@/lib/embed-auth';

export default function ExportTransactionsPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [downloading, setDownloading] = useState(false);
  const token = useEmbedToken();

  const download = async () => {
    setDownloading(true);
    try {
      const res = await fetch(
        apiUrl(`/api/export-transactions?from=${from}&to=${to}`),
        { headers: authHeaders(token) },
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

  return (
    <div>
      <h1>Export Transactions</h1>
      <div style={{ display: 'flex', gap: 12, alignItems: 'end' }}>
        <label>
          From
          <br />
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </label>
        <label>
          To
          <br />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </label>
        <button onClick={download} disabled={downloading}>
          {downloading ? 'Downloading...' : 'Download Excel'}
        </button>
      </div>
    </div>
  );
}
