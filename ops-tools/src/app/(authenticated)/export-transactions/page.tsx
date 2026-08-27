'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@lib/components/ui/button';
import { Input } from '@lib/components/ui/input';
import { Label } from '@lib/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@lib/components/ui/card';
import { useTranslation } from '@lib/i18n/locale-provider';

export default function ExportTransactionsPage() {
  const { t } = useTranslation();
  const today = new Date().toISOString().slice(0, 10);
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [downloading, setDownloading] = useState(false);

  const download = async () => {
    setDownloading(true);
    try {
      const res = await fetch(`/api/export-transactions?from=${from}&to=${to}`);
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
    <div className="p-6 max-w-xl">
      <Card>
        <CardHeader>
          <CardTitle>{t('nav.exportTransactions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            <div className="grid gap-2">
              <Label htmlFor="from">{t('exportTransactions.from')}</Label>
              <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="to">{t('exportTransactions.to')}</Label>
              <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <Button onClick={download} loading={downloading}>
              <Download className="size-4" />
              {t('exportTransactions.download')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
